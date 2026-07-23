import { ProjectGallery } from "@/components/ProjectGallery";
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
    <ProjectGallery
      name={decodedPortrait}
      images={images}
      backPath="/projects"
    />
  );
}
