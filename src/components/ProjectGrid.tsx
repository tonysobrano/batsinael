import Link from 'next/link';
import { ProjectData } from '@/lib/images';
import { SkeletonImage } from './SkeletonImage';

interface ProjectGridProps {
  projects: ProjectData[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="columns-1 gap-x-[22px] sm:columns-2 md:columns-3 lg:columns-4">
      {projects.map((project, index) => (
        <div key={`${project.path}-${index}`} className="break-inside-avoid mb-[34px]">
          <Link href={project.path} className="group block">
            <SkeletonImage
              src={project.cover}
              alt={project.name}
              wrapperClassName="mb-[10px] min-h-0"
              className="group-hover:scale-[1.015]"
              priority={index < 4}
            />
            <p className="text-[12px] leading-[1.35] text-black opacity-55 transition-opacity duration-200 group-hover:opacity-100 md:text-[10px]">
              {project.name}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}
