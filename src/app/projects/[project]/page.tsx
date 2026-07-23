import { ImageGrid } from "@/components/ImageGrid";
import { getImagesFromDirectory, getProjectsWithCovers } from "@/lib/images";

export function generateStaticParams() {
  return getProjectsWithCovers("img/projects").map((project) => ({
    project: project.name,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ project: string }> }) {
  const resolvedParams = await params;
  const decodedProject = decodeURIComponent(resolvedParams.project);
  const images = getImagesFromDirectory(`img/projects/${decodedProject}`);

  return (
    <div className="w-full">
      <h1 className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-8">{decodedProject}</h1>
      <ImageGrid images={images} />
    </div>
  );
}
