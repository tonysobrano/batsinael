import { ProjectGrid } from "@/components/ProjectGrid";
import { getHomeGridImages } from "@/lib/images";

export default function Home() {
  const projects = getHomeGridImages();

  return (
    <div className="w-full">
      <ProjectGrid projects={projects} interactiveImages />
    </div>
  );
}
