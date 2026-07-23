import { WorksIndex } from "@/components/WorksIndex";
import { getPortfolioGroups } from "@/lib/images";

export default function Portraits() {
  return <WorksIndex groups={getPortfolioGroups()} initialFilter="portraits" />;
}
