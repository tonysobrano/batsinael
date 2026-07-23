import { WorksIndex } from "@/components/WorksIndex";
import { getPortfolioGroups } from "@/lib/images";

export default function Projects() {
  return <WorksIndex groups={getPortfolioGroups()} />;
}
