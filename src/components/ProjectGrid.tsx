import Link from 'next/link';
import { ProjectData } from '@/lib/images';
import { SkeletonImage } from './SkeletonImage';

interface ProjectGridProps {
  projects: ProjectData[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {projects.map((project, index) => (
        <div key={`${project.path}-${index}`} className="break-inside-avoid">
          <Link href={project.path} className="group block">
            <SkeletonImage
              src={project.cover}
              alt={project.name}
              wrapperClassName="mb-2"
              className="group-hover:scale-[1.02]"
            />
            <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500 group-hover:text-black transition-colors duration-300">
              {project.name}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}
