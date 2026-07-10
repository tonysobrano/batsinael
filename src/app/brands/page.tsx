import { ProjectGrid } from "@/components/ProjectGrid";
import { getProjectsWithCovers } from "@/lib/images";

export const dynamic = 'force-dynamic';

export default function Brands() {
  const projects = getProjectsWithCovers('img/brands');

  return (
    <div className="w-full">
      <ProjectGrid projects={projects} />
    </div>
  );
}
