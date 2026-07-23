import Link from 'next/link';
import { ProjectData } from '@/lib/images';
import { ProjectGridImage } from './ProjectGridImage';
import { SkeletonImage } from './SkeletonImage';

interface ProjectGridProps {
  projects: ProjectData[];
  interactiveImages?: boolean;
}

function shouldAutoRotate(path: string, index: number): boolean {
  let hash = 0;
  const key = `${path}-${index}`;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 100 < 32;
}

export function ProjectGrid({ projects, interactiveImages = false }: ProjectGridProps) {
  return (
    <div className="columns-1 gap-x-[22px] sm:columns-2 md:columns-3 lg:columns-4">
      {projects.map((project, index) => (
        <div key={`${project.path}-${index}`} className="break-inside-avoid mb-[34px]">
          <Link href={project.path} className="group block">
            {interactiveImages && project.images.length > 1 ? (
              <ProjectGridImage
                images={project.images}
                alt={project.name}
                eager={index < 2}
                autoRotate={shouldAutoRotate(project.path, index)}
              />
            ) : (
              <SkeletonImage
                image={project.cover}
                alt={project.name}
                wrapperClassName="mb-[10px] min-h-0"
                className="group-hover:scale-[1.015]"
                eager={index < 2}
              />
            )}
            <p className="text-[12px] leading-[1.35] text-black opacity-55 transition-opacity duration-200 group-hover:opacity-100 md:text-[10px]">
              {project.name}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}
