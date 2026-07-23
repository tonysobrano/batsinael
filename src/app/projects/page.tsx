import { ProjectGrid } from "@/components/ProjectGrid";
import { getProjectsWithCovers } from "@/lib/images";

export default function Projects() {
  const projects = getProjectsWithCovers('img/projects');

  return (
    <div className="w-full">
      <ProjectGrid projects={projects} />
    </div>
  );
}
