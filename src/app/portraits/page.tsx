import { ProjectGrid } from "@/components/ProjectGrid";
import { getProjectsWithCovers } from "@/lib/images";

export const dynamic = 'force-dynamic';

export default function Portraits() {
  const projects = getProjectsWithCovers('img/portraits');

  return (
    <div className="w-full">
      <ProjectGrid projects={projects} />
    </div>
  );
}
