import { ProjectGrid } from "@/components/ProjectGrid";
import { getProjectsWithCovers } from "@/lib/images";

export const dynamic = 'force-dynamic';

export default function Projects() {
  const projects = getProjectsWithCovers('img/projects');

  return (
    <div className="w-full">
      <ProjectGrid projects={projects} />
    </div>
  );
}
