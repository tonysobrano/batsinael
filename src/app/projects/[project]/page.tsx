import { ProjectGallery } from "@/components/ProjectGallery";
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
    <ProjectGallery
      name={decodedProject}
      images={images}
      backPath="/projects"
    />
  );
}
