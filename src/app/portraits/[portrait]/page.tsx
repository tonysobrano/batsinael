import { ImageGrid } from "@/components/ImageGrid";
import { getImagesFromDirectory, getProjectsWithCovers } from "@/lib/images";

export function generateStaticParams() {
  return getProjectsWithCovers("img/portraits").map((portrait) => ({
    portrait: portrait.name,
  }));
}

export default async function PortraitPage({ params }: { params: Promise<{ portrait: string }> }) {
  const resolvedParams = await params;
  const decodedPortrait = decodeURIComponent(resolvedParams.portrait);
  const images = getImagesFromDirectory(`img/portraits/${decodedPortrait}`);

  return (
    <div className="w-full">
      <h1 className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-8">{decodedPortrait}</h1>
      <ImageGrid images={images} />
    </div>
  );
}
