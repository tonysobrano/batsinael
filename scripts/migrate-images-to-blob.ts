import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  mkdir,
  mkdtemp,
  readdir,
  rm,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import {
  basename,
  dirname,
  extname,
  join,
  posix,
  relative,
  resolve,
} from "node:path";
import { fileURLToPath } from "node:url";
import { list, put, type ListBlobResultBlob } from "@vercel/blob";
import sharp from "sharp";

const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const MAX_LONG_EDGE = 3000;
const WEBP_QUALITY = 92;
const WEBP_EFFORT = 6;
const BLOB_PREFIX = "portfolio/";
const ONE_GB = 1_000_000_000;
const TEN_GB = 10_000_000_000;

const repositoryRoot = resolve(fileURLToPath(new URL("../", import.meta.url)));
const sourceRoot = join(repositoryRoot, "public", "img");
const manifestPath = join(repositoryRoot, "src", "lib", "blob-manifest.ts");
const reportsDirectory = join(repositoryRoot, "reports");

interface SourceImage {
  absolutePath: string;
  relativePath: string;
  category: string;
  collection: string;
  collectionOrder: number;
  sourceOrder: number;
  pathname: string;
}

interface ProcessedImage {
  url: string;
  pathname: string;
  width: number;
  height: number;
  bytes: number;
  sourceWidth: number;
  sourceHeight: number;
  sourceBytes: number;
  category: string;
  collection: string;
  filename: string;
  relativePath: string;
  sourceFilename: string;
  sourceFormat: string;
  sourceOrder: number;
  collectionOrder: number;
  sha256: string;
  sourceSha256: string;
  sourceOrientation: number | null;
  outputOrientation: number | null;
  sourceHasIccProfile: boolean;
  outputHasIccProfile: boolean;
  resized: boolean;
  upscaled: boolean;
  orientationChanged: boolean;
  uploadStatus: "uploaded" | "replaced" | "skipped";
}

interface FailedImage {
  relativePath: string;
  message: string;
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function toPosixPath(value: string): string {
  return value.split("\\").join("/");
}

function replaceExtension(relativePath: string): string {
  return relativePath.slice(0, -extname(relativePath).length) + ".webp";
}

async function walkDirectory(
  directory: string,
  images: Omit<SourceImage, "pathname">[],
  collectionOrders: Map<string, number>,
  sourceOrders: Map<string, number>,
): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true });

  for (let entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
    const entry = entries[entryIndex];
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      await walkDirectory(absolutePath, images, collectionOrders, sourceOrders);
      continue;
    }

    if (!entry.isFile() || !SUPPORTED_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      continue;
    }

    const relativePath = toPosixPath(relative(sourceRoot, absolutePath));
    const segments = relativePath.split("/");
    const category = segments[0] ?? "uncategorized";
    const collection = segments.length > 2 ? segments[1] : category;
    const collectionKey = `${category}/${collection}`;

    if (!collectionOrders.has(collectionKey)) {
      const categoryDirectory = join(sourceRoot, category);
      const categoryEntries = await readdir(categoryDirectory, { withFileTypes: true });
      const collectionDirectoryName = segments.length > 2 ? segments[1] : null;
      const collectionOrder = collectionDirectoryName
        ? categoryEntries.findIndex(
            (categoryEntry) =>
              categoryEntry.isDirectory() && categoryEntry.name === collectionDirectoryName,
          )
        : -1;
      collectionOrders.set(collectionKey, collectionOrder);
    }

    const sourceOrder = sourceOrders.get(collectionKey) ?? 0;
    sourceOrders.set(collectionKey, sourceOrder + 1);

    images.push({
      absolutePath,
      relativePath,
      category,
      collection,
      collectionOrder: collectionOrders.get(collectionKey) ?? -1,
      sourceOrder,
    });
  }
}

async function discoverSourceImages(): Promise<SourceImage[]> {
  const images: Omit<SourceImage, "pathname">[] = [];
  await walkDirectory(sourceRoot, images, new Map(), new Map());

  const candidateGroups = new Map<string, Omit<SourceImage, "pathname">[]>();
  for (const image of images) {
    const candidate = posix.join(BLOB_PREFIX, replaceExtension(image.relativePath));
    const key = candidate.toLocaleLowerCase("en-US");
    const group = candidateGroups.get(key) ?? [];
    group.push(image);
    candidateGroups.set(key, group);
  }

  return images.map((image) => {
    const candidate = posix.join(BLOB_PREFIX, replaceExtension(image.relativePath));
    const group = candidateGroups.get(candidate.toLocaleLowerCase("en-US")) ?? [];
    let pathname = candidate;

    if (group.length > 1) {
      const sourceExtension = extname(image.relativePath).slice(1).toLowerCase();
      const outputDirectory = dirname(candidate);
      const outputStem = basename(candidate, ".webp");
      pathname = posix.join(outputDirectory, `${outputStem}--${sourceExtension}.webp`);
    }

    return { ...image, pathname };
  });
}

async function listExistingBlobs(token: string): Promise<Map<string, ListBlobResultBlob>> {
  const blobs = new Map<string, ListBlobResultBlob>();
  let cursor: string | undefined;

  do {
    const page = await list({
      token,
      prefix: BLOB_PREFIX,
      limit: 1000,
      cursor,
    });

    for (const blob of page.blobs) {
      blobs.set(blob.pathname, blob);
    }

    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return blobs;
}

async function sha256(filePath: string): Promise<string> {
  return await new Promise((resolvePromise, rejectPromise) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", rejectPromise);
    stream.on("end", () => resolvePromise(hash.digest("hex")));
  });
}

function displayDimensions(
  width: number,
  height: number,
  orientation: number | undefined,
): { width: number; height: number } {
  if (orientation && orientation >= 5 && orientation <= 8) {
    return { width: height, height: width };
  }
  return { width, height };
}

async function processImage(
  source: SourceImage,
  existingBlobs: Map<string, ListBlobResultBlob>,
  temporaryDirectory: string,
  token: string,
): Promise<ProcessedImage> {
  const sourceMetadata = await sharp(source.absolutePath).metadata();
  if (!sourceMetadata.width || !sourceMetadata.height || !sourceMetadata.format) {
    throw new Error("Sharp could not determine source dimensions or format");
  }

  const sourceStats = await stat(source.absolutePath);
  const sourceSha256 = await sha256(source.absolutePath);
  const temporaryPath = join(
    temporaryDirectory,
    `${createHash("sha1").update(source.relativePath).digest("hex")}.webp`,
  );

  try {
    await sharp(source.absolutePath, { failOn: "warning" })
      .rotate()
      .resize({
        width: MAX_LONG_EDGE,
        height: MAX_LONG_EDGE,
        fit: "inside",
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3,
      })
      .keepMetadata()
      .webp({
        quality: WEBP_QUALITY,
        effort: WEBP_EFFORT,
        preset: "photo",
        smartSubsample: true,
        smartDeblock: false,
        alphaQuality: 100,
        exact: true,
      })
      .toFile(temporaryPath);

    const [outputMetadata, outputStats, outputSha256] = await Promise.all([
      sharp(temporaryPath).metadata(),
      stat(temporaryPath),
      sha256(temporaryPath),
    ]);

    if (!outputMetadata.width || !outputMetadata.height) {
      throw new Error("Sharp could not determine output dimensions");
    }

    const existing = existingBlobs.get(source.pathname);
    let url: string;
    let uploadStatus: ProcessedImage["uploadStatus"];

    if (existing && existing.size === outputStats.size) {
      url = existing.url;
      uploadStatus = "skipped";
    } else {
      const result = await put(source.pathname, createReadStream(temporaryPath), {
        token,
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: Boolean(existing),
        ifMatch: existing?.etag,
        contentType: "image/webp",
        cacheControlMaxAge: 30 * 24 * 60 * 60,
      });
      url = result.url;
      uploadStatus = existing ? "replaced" : "uploaded";
      existingBlobs.set(source.pathname, {
        ...existing,
        url: result.url,
        downloadUrl: result.downloadUrl,
        pathname: result.pathname,
        size: outputStats.size,
        uploadedAt: new Date(),
        etag: result.etag,
      });
    }

    const visibleSource = displayDimensions(
      sourceMetadata.width,
      sourceMetadata.height,
      sourceMetadata.orientation,
    );
    const resized =
      outputMetadata.width !== visibleSource.width ||
      outputMetadata.height !== visibleSource.height;
    const upscaled =
      outputMetadata.width > visibleSource.width ||
      outputMetadata.height > visibleSource.height;

    return {
      url,
      pathname: source.pathname,
      width: outputMetadata.width,
      height: outputMetadata.height,
      bytes: outputStats.size,
      sourceWidth: sourceMetadata.width,
      sourceHeight: sourceMetadata.height,
      sourceBytes: sourceStats.size,
      category: source.category,
      collection: source.collection,
      filename: basename(source.pathname),
      relativePath: source.relativePath,
      sourceFilename: basename(source.relativePath),
      sourceFormat: sourceMetadata.format,
      sourceOrder: source.sourceOrder,
      collectionOrder: source.collectionOrder,
      sha256: outputSha256,
      sourceSha256,
      sourceOrientation: sourceMetadata.orientation ?? null,
      outputOrientation: outputMetadata.orientation ?? null,
      sourceHasIccProfile: Boolean(sourceMetadata.icc?.length),
      outputHasIccProfile: Boolean(outputMetadata.icc?.length),
      resized,
      upscaled,
      orientationChanged:
        sourceMetadata.orientation !== undefined && sourceMetadata.orientation !== 1,
      uploadStatus,
    };
  } finally {
    await unlink(temporaryPath).catch(() => undefined);
  }
}

async function validateBlobUrls(entries: ProcessedImage[]): Promise<void> {
  const queue = [...entries];
  const failures: string[] = [];
  const workerCount = Math.min(8, queue.length);

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (queue.length > 0) {
        const entry = queue.shift();
        if (!entry) return;

        let valid = false;
        let lastStatus = 0;
        for (let attempt = 0; attempt < 3; attempt += 1) {
          const response = await fetch(entry.url, { method: "HEAD", redirect: "follow" });
          lastStatus = response.status;
          if (response.ok) {
            valid = true;
            break;
          }
          await new Promise((resolvePromise) => setTimeout(resolvePromise, 500 * (attempt + 1)));
        }

        if (!valid) {
          failures.push(`${entry.relativePath} (HTTP ${lastStatus})`);
        }
      }
    }),
  );

  if (failures.length > 0) {
    throw new Error(`Blob URL validation failed:\n${failures.join("\n")}`);
  }
}

function manifestSource(entries: ProcessedImage[]): string {
  const manifestEntries = entries.map((entry) =>
    Object.fromEntries(
      Object.entries(entry).filter(([key]) => key !== "uploadStatus"),
    ),
  );

  return `// Generated by scripts/migrate-images-to-blob.ts. Do not edit manually.
export interface BlobManifestEntry {
  url: string;
  pathname: string;
  width: number;
  height: number;
  bytes: number;
  sourceWidth: number;
  sourceHeight: number;
  sourceBytes: number;
  category: string;
  collection: string;
  filename: string;
  relativePath: string;
  sourceFilename: string;
  sourceFormat: string;
  sourceOrder: number;
  collectionOrder: number;
  sha256: string;
  sourceSha256: string;
  sourceOrientation: number | null;
  outputOrientation: number | null;
  sourceHasIccProfile: boolean;
  outputHasIccProfile: boolean;
  resized: boolean;
  upscaled: boolean;
  orientationChanged: boolean;
}

export const blobManifest = ${JSON.stringify(manifestEntries, null, 2)} as const satisfies readonly BlobManifestEntry[];
`;
}

function formatBytes(bytes: number): string {
  const units = ["B", "KiB", "MiB", "GiB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

function formatRatio(numerator: number, denominator: number): string {
  return denominator === 0 ? "n/a" : `${(numerator / denominator).toFixed(3)}×`;
}

function selectSpotChecks(entries: ProcessedImage[]): ProcessedImage[] {
  const selectAcrossCollections = (category: string, count: number): ProcessedImage[] => {
    const categoryEntries = entries
      .filter((entry) => entry.category === category)
      .sort(
        (left, right) =>
          left.collectionOrder - right.collectionOrder ||
          left.sourceOrder - right.sourceOrder ||
          compareText(left.relativePath, right.relativePath),
      );
    const selected: ProcessedImage[] = [];
    const collections = new Set<string>();

    for (const entry of categoryEntries) {
      if (!collections.has(entry.collection)) {
        selected.push(entry);
        collections.add(entry.collection);
      }
      if (selected.length === count) return selected;
    }

    for (const entry of categoryEntries) {
      if (!selected.includes(entry)) selected.push(entry);
      if (selected.length === count) return selected;
    }

    return selected;
  };

  return [
    ...selectAcrossCollections("portraits", 3),
    ...selectAcrossCollections("projects", 3),
    ...selectAcrossCollections("brands", 3),
    ...selectAcrossCollections("bats", 1),
  ];
}

function spotCheckReport(entries: ProcessedImage[]): string {
  const selected = selectSpotChecks(entries);
  const rows = selected.map((entry) => {
    const profilePreserved = entry.sourceHasIccProfile
      ? entry.outputHasIccProfile
        ? "yes"
        : "no"
      : "not present in source";
    return `| ${entry.relativePath.replaceAll("|", "\\|")} | ${entry.sourceWidth}×${entry.sourceHeight} | ${entry.width}×${entry.height} | ${entry.sourceBytes} | ${entry.bytes} | ${formatRatio(entry.bytes, entry.sourceBytes)} | ${profilePreserved} | ${entry.resized ? "yes" : "no"} | ${entry.upscaled ? "yes" : "no"} | ${entry.orientationChanged ? "yes" : "no"} |`;
  });

  return `# Visual spot-check report

All outputs were generated with Sharp WebP quality ${WEBP_QUALITY}, effort ${WEBP_EFFORT}, high-quality chroma subsampling, EXIF auto-orientation, metadata retention, and a ${MAX_LONG_EDGE}px maximum long edge. No sharpening, denoising, or tonal/color enhancement was applied.

| Source | Source dimensions | Output dimensions | Source bytes | Output bytes | Output/source | ICC/profile preserved | Resized | Upscaled | Orientation changed |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
${rows.join("\n")}
`;
}

function migrationSummary(
  entries: ProcessedImage[],
  failed: FailedImage[],
  discoveredCount: number,
): { json: Record<string, unknown>; markdown: string } {
  const sourceBytes = entries.reduce((sum, entry) => sum + entry.sourceBytes, 0);
  const blobBytes = entries.reduce((sum, entry) => sum + entry.bytes, 0);
  const uploadedCount = entries.filter((entry) => entry.uploadStatus === "uploaded").length;
  const replacedCount = entries.filter((entry) => entry.uploadStatus === "replaced").length;
  const skippedCount = entries.filter((entry) => entry.uploadStatus === "skipped").length;
  const collections = new Map<string, ProcessedImage[]>();

  for (const entry of entries.filter((item) =>
    ["projects", "brands", "portraits"].includes(item.category),
  )) {
    const key = `${entry.category}/${entry.collection}`;
    const collectionEntries = collections.get(key) ?? [];
    collectionEntries.push(entry);
    collections.set(key, collectionEntries);
  }

  const homepageBytes = [...collections.values()].reduce((sum, collectionEntries) => {
    const cover = [...collectionEntries].sort(
      (left, right) => left.sourceOrder - right.sourceOrder,
    )[0];
    return sum + (cover?.bytes ?? 0);
  }, 0);
  const averageGalleryBytes =
    collections.size === 0
      ? 0
      : [...collections.values()].reduce(
          (sum, collectionEntries) =>
            sum + collectionEntries.reduce((gallerySum, entry) => gallerySum + entry.bytes, 0),
          0,
        ) / collections.size;
  const averageBlobBytes = entries.length === 0 ? 0 : blobBytes / entries.length;
  const scenarios = {
    homepageOnly: {
      bytesPerVisit: Math.round(homepageBytes),
      visitorsPer10GB: homepageBytes === 0 ? 0 : Math.floor(TEN_GB / homepageBytes),
    },
    homepagePlusOneAverageGallery: {
      bytesPerVisit: Math.round(homepageBytes + averageGalleryBytes),
      visitorsPer10GB:
        homepageBytes + averageGalleryBytes === 0
          ? 0
          : Math.floor(TEN_GB / (homepageBytes + averageGalleryBytes)),
    },
    thirtyImagesViewed: {
      bytesPerVisit: Math.round(averageBlobBytes * 30),
      visitorsPer10GB:
        averageBlobBytes === 0 ? 0 : Math.floor(TEN_GB / (averageBlobBytes * 30)),
    },
  };

  const json = {
    generatedAt: new Date().toISOString(),
    settings: {
      outputFormat: "webp",
      quality: WEBP_QUALITY,
      effort: WEBP_EFFORT,
      maximumLongEdge: MAX_LONG_EDGE,
      withoutEnlargement: true,
    },
    totalSourceImages: discoveredCount,
    totalSourceBytes: sourceBytes,
    totalBlobBytes: blobBytes,
    averageSourceBytes: entries.length === 0 ? 0 : Math.round(sourceBytes / entries.length),
    averageBlobBytes: Math.round(averageBlobBytes),
    compressionRatio: sourceBytes === 0 ? 0 : blobBytes / sourceBytes,
    uploadedCount,
    replacedCount,
    skippedCount,
    failedCount: failed.length,
    manifestCount: entries.length,
    storage: {
      limitBytes: ONE_GB,
      usedBytes: blobBytes,
      usagePercent: (blobBytes / ONE_GB) * 100,
      remainingBytes: ONE_GB - blobBytes,
    },
    transfer: {
      limitBytes: TEN_GB,
      estimationBasis:
        "Conservative full Blob derivative sizes before responsive next/image savings",
      scenarios,
    },
    failed,
  };

  const markdown = `# Image migration summary

- Total source images: ${discoveredCount}
- Total source bytes: ${sourceBytes} (${formatBytes(sourceBytes)})
- Total Blob bytes: ${blobBytes} (${formatBytes(blobBytes)})
- Average source size: ${formatBytes(entries.length === 0 ? 0 : sourceBytes / entries.length)}
- Average Blob size: ${formatBytes(averageBlobBytes)}
- Compression ratio (Blob/source): ${formatRatio(blobBytes, sourceBytes)}
- Uploaded: ${uploadedCount}
- Replaced: ${replacedCount}
- Skipped: ${skippedCount}
- Failed: ${failed.length}
- Manifest entries: ${entries.length}
- Estimated 1 GB Blob usage: ${((blobBytes / ONE_GB) * 100).toFixed(2)}%

## Estimated visitor capacity against 10 GB monthly transfer

These are conservative upper-bound estimates using full Blob derivative sizes. Responsive \`next/image\` variants should reduce real visitor transfer, especially on mobile.

| Scenario | Estimated bytes per visit | Estimated visitors per 10 GB |
| --- | ---: | ---: |
| Homepage only | ${Math.round(scenarios.homepageOnly.bytesPerVisit)} (${formatBytes(scenarios.homepageOnly.bytesPerVisit)}) | ${scenarios.homepageOnly.visitorsPer10GB} |
| Homepage plus one average gallery | ${Math.round(scenarios.homepagePlusOneAverageGallery.bytesPerVisit)} (${formatBytes(scenarios.homepagePlusOneAverageGallery.bytesPerVisit)}) | ${scenarios.homepagePlusOneAverageGallery.visitorsPer10GB} |
| 30 images viewed | ${Math.round(scenarios.thirtyImagesViewed.bytesPerVisit)} (${formatBytes(scenarios.thirtyImagesViewed.bytesPerVisit)}) | ${scenarios.thirtyImagesViewed.visitorsPer10GB} |
`;

  return { json, markdown };
}

async function main(): Promise<void> {
  const verifyIdempotency = process.argv.includes("--verify-idempotency");
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not available in process.env");
  }

  const sources = await discoverSourceImages();
  if (sources.length === 0) {
    throw new Error(`No supported source images were found under ${sourceRoot}`);
  }

  const relativePaths = new Set(sources.map((source) => source.relativePath));
  const pathnames = new Set(sources.map((source) => source.pathname));
  if (relativePaths.size !== sources.length) {
    throw new Error("Duplicate source relative paths were discovered");
  }
  if (pathnames.size !== sources.length) {
    throw new Error("Destination Blob pathname collision detected");
  }

  console.log(`Discovered ${sources.length} supported source images.`);
  const existingBlobs = await listExistingBlobs(token);
  console.log(`Found ${existingBlobs.size} existing Blob objects under ${BLOB_PREFIX}.`);

  const temporaryDirectory = await mkdtemp(join(tmpdir(), "batsinael-blob-migration-"));
  const processed: ProcessedImage[] = [];
  const failed: FailedImage[] = [];

  try {
    for (let index = 0; index < sources.length; index += 1) {
      const source = sources[index];
      try {
        const result = await processImage(
          source,
          existingBlobs,
          temporaryDirectory,
          token,
        );
        processed.push(result);
        console.log(
          `[${index + 1}/${sources.length}] ${result.uploadStatus}: ${source.relativePath} -> ${result.pathname}`,
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failed.push({ relativePath: source.relativePath, message });
        console.error(`[${index + 1}/${sources.length}] failed: ${source.relativePath}: ${message}`);
      }
    }
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }

  const sortedEntries = processed.sort((left, right) =>
    compareText(left.relativePath, right.relativePath),
  );
  await mkdir(reportsDirectory, { recursive: true });

  if (failed.length > 0) {
    throw new Error(`${failed.length} image(s) failed; manifest was not replaced`);
  }
  if (sortedEntries.length !== sources.length) {
    throw new Error(
      `Processed count ${sortedEntries.length} does not match source count ${sources.length}`,
    );
  }
  if (new Set(sortedEntries.map((entry) => entry.relativePath)).size !== sources.length) {
    throw new Error("Manifest would contain duplicate relative paths");
  }

  console.log("Validating every public Blob URL.");
  await validateBlobUrls(sortedEntries);

  if (verifyIdempotency) {
    const nonSkipped = sortedEntries.filter((entry) => entry.uploadStatus !== "skipped");
    if (nonSkipped.length > 0) {
      throw new Error(
        `Idempotency verification expected every object to be skipped, but ${nonSkipped.length} object(s) were uploaded or replaced`,
      );
    }

    const idempotencyJson = {
      generatedAt: new Date().toISOString(),
      sourceImages: sources.length,
      existingBlobObjects: existingBlobs.size,
      skippedCount: sortedEntries.length,
      uploadedCount: 0,
      replacedCount: 0,
      failedCount: 0,
      urlValidationCount: sortedEntries.length,
      result: "passed",
    };
    const idempotencyMarkdown = `# Image migration idempotency verification

- Source images: ${sources.length}
- Existing Blob objects: ${existingBlobs.size}
- Skipped as unchanged: ${sortedEntries.length}
- Uploaded: 0
- Replaced: 0
- Failed: 0
- Public URLs validated: ${sortedEntries.length}
- Result: passed
`;
    await Promise.all([
      writeFile(
        join(reportsDirectory, "image-migration-idempotency.json"),
        `${JSON.stringify(idempotencyJson, null, 2)}\n`,
        "utf8",
      ),
      writeFile(
        join(reportsDirectory, "image-migration-idempotency.md"),
        idempotencyMarkdown,
        "utf8",
      ),
    ]);
    console.log(`Idempotency verification complete: ${sortedEntries.length} unchanged objects skipped.`);
    return;
  }

  const summary = migrationSummary(sortedEntries, failed, sources.length);
  await Promise.all([
    writeFile(
      join(reportsDirectory, "image-migration-summary.json"),
      `${JSON.stringify(summary.json, null, 2)}\n`,
      "utf8",
    ),
    writeFile(
      join(reportsDirectory, "image-migration-summary.md"),
      summary.markdown,
      "utf8",
    ),
  ]);
  await Promise.all([
    writeFile(manifestPath, manifestSource(sortedEntries), "utf8"),
    writeFile(
      join(reportsDirectory, "visual-spot-check.json"),
      `${JSON.stringify(selectSpotChecks(sortedEntries), null, 2)}\n`,
      "utf8",
    ),
    writeFile(
      join(reportsDirectory, "visual-spot-check.md"),
      spotCheckReport(sortedEntries),
      "utf8",
    ),
  ]);

  const uploadedOrSkipped = sortedEntries.filter((entry) =>
    ["uploaded", "replaced", "skipped"].includes(entry.uploadStatus),
  ).length;
  if (uploadedOrSkipped !== sources.length) {
    throw new Error("Uploaded/skipped validation count does not match the source count");
  }

  console.log(
    `Migration complete: ${sources.length} source images, ${sortedEntries.length} manifest entries, ${failed.length} failures.`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Migration failed: ${message}`);
  process.exitCode = 1;
});
