import {
  blobManifest,
  type BlobManifestEntry,
} from "@/lib/blob-manifest";

export interface ProjectData {
  name: string;
  cover: PortfolioImage;
  images: PortfolioImage[];
  path: string;
}

export interface PortfolioImage {
  url: string;
  width: number;
  height: number;
  relativePath: string;
}

const manifest: readonly BlobManifestEntry[] = blobManifest;
const HOME_ROTATION_IMAGE_LIMIT = 4;

function toPortfolioImage(image: BlobManifestEntry): PortfolioImage {
  return {
    url: image.url,
    width: image.width,
    height: image.height,
    relativePath: image.relativePath,
  };
}

function normalizeDirectory(directory: string): string {
  return directory
    .replace(/^\/+/, "")
    .replace(/^img\/?/, "")
    .replace(/\/+$/, "");
}

function directoryOf(relativePath: string): string {
  const separatorIndex = relativePath.lastIndexOf("/");
  return separatorIndex === -1 ? "" : relativePath.slice(0, separatorIndex);
}

function compareImages(left: BlobManifestEntry, right: BlobManifestEntry): number {
  return (
    left.sourceOrder - right.sourceOrder ||
    left.relativePath.localeCompare(right.relativePath, "en")
  );
}

export function getImagesFromDirectory(directory: string): PortfolioImage[] {
  const normalizedDirectory = normalizeDirectory(directory);
  return manifest
    .filter((image) => directoryOf(image.relativePath) === normalizedDirectory)
    .slice()
    .sort(compareImages)
    .map(toPortfolioImage);
}

export function getProjectsWithCovers(categoryDir: string): ProjectData[] {
  const category = normalizeDirectory(categoryDir);
  const collections = new Map<string, BlobManifestEntry[]>();

  for (const image of manifest) {
    if (image.category !== category || image.collection === category) {
      continue;
    }

    const images = collections.get(image.collection) ?? [];
    images.push(image);
    collections.set(image.collection, images);
  }

  return [...collections.entries()]
    .map(([name, images]) => {
      const orderedImages = images.slice().sort(compareImages);
      return {
        name,
        cover: toPortfolioImage(orderedImages[0]),
        images: orderedImages.map(toPortfolioImage),
        path: `/${category}/${encodeURIComponent(name)}`,
        collectionOrder: Math.min(...orderedImages.map((image) => image.collectionOrder)),
      };
    })
    .sort(
      (left, right) =>
        left.collectionOrder - right.collectionOrder ||
        left.name.localeCompare(right.name, "en"),
    )
    .map((project) => ({
      name: project.name,
      cover: project.cover,
      images: project.images,
      path: project.path,
    }));
}

export function getHomeGridImages(): ProjectData[] {
  const categories = ["img/projects", "img/brands", "img/portraits"];
  let allProjects: ProjectData[] = [];

  for (const category of categories) {
    allProjects = [...allProjects, ...getProjectsWithCovers(category)];
  }

  allProjects = allProjects.map((project) => ({
    ...project,
    images: project.images.slice(0, HOME_ROTATION_IMAGE_LIMIT),
  }));

  for (let i = allProjects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allProjects[i], allProjects[j]] = [allProjects[j], allProjects[i]];
  }

  return allProjects;
}
