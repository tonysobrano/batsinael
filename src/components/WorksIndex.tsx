"use client";

import Link from "next/link";
import { useState } from "react";
import { RotatingProjectImage } from "@/components/RotatingProjectImage";
import type {
  PortfolioCategory,
  PortfolioGroup,
  ProjectData,
} from "@/lib/images";

type Filter = "all" | PortfolioCategory;

interface WorksIndexProps {
  groups: PortfolioGroup[];
  initialFilter?: Filter;
}

const allWorksDesktopSlots = [
  1, 2, 3, 5,
  6, 8, 9, 10,
  12, 13, 15,
  16, 17, 19, 20,
  22, 23, 24,
];

function WorkCard({
  project,
  category,
  index,
  mobile = false,
  layoutSlot,
}: {
  project: ProjectData;
  category: string;
  index: number;
  mobile?: boolean;
  layoutSlot?: number;
}) {
  const gridPosition = layoutSlot
    ? {
        gridColumn: ((layoutSlot - 1) % 5) + 1,
        gridRow: Math.floor((layoutSlot - 1) / 5) + 1,
      }
    : undefined;

  return (
    <Link href={project.path} className="work-card" style={gridPosition}>
      <div className="work-card-image">
        <RotatingProjectImage
          images={project.images}
          mobile={mobile}
          name={project.name}
          preload={index < (mobile ? 2 : 4)}
          sizes={
            mobile
              ? "168px"
              : "(max-width: 1100px) calc((100vw - 75px) / 3), calc((100vw - 135px) / 4)"
          }
        />
      </div>
      <div className="work-card-meta">
        <p>
          <strong>{project.name}</strong>
          <span>{category}</span>
        </p>
        <span className="work-card-count">{project.images.length}</span>
      </div>
    </Link>
  );
}

export function WorksIndex({
  groups,
  initialFilter = "all",
}: WorksIndexProps) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const allProjects = groups.flatMap((group) =>
    group.projects.map((project) => ({ project, group })),
  );
  const visibleProjects =
    filter === "all"
      ? allProjects
      : allProjects.filter(({ group }) => group.id === filter);

  return (
    <div className="works-page">
      <div className="works-toolbar">
        <button
          type="button"
          className={filter === "all" ? "is-active" : undefined}
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
        >
          All works ({allProjects.length})
        </button>
        <div>
          {groups.map((group) => (
            <button
              type="button"
              key={group.id}
              className={filter === group.id ? "is-active" : undefined}
              onClick={() => setFilter(group.id)}
              aria-pressed={filter === group.id}
            >
              {group.label} ({group.projects.length})
            </button>
          ))}
        </div>
      </div>

      <div className="works-desktop-grid">
        {visibleProjects.map(({ project, group }, index) => (
          <WorkCard
            key={project.path}
            project={project}
            category={group.label}
            index={index}
            layoutSlot={
              filter === "all" ? allWorksDesktopSlots[index] : undefined
            }
          />
        ))}
      </div>

      <div className="works-mobile-groups">
        {groups.map((group) => (
          <section key={group.id} className="works-mobile-group">
            <h1>
              {group.label} ({group.projects.length})
            </h1>
            <div className="works-mobile-row">
              {group.projects.map((project, index) => (
                <WorkCard
                  key={project.path}
                  project={project}
                  category={group.label}
                  index={index}
                  mobile
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
