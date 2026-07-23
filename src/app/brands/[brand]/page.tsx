import { ProjectGallery } from "@/components/ProjectGallery";
import { getImagesFromDirectory, getProjectsWithCovers } from "@/lib/images";

export function generateStaticParams() {
  return getProjectsWithCovers("img/brands").map((brand) => ({
    brand: brand.name,
  }));
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const resolvedParams = await params;
  const decodedBrand = decodeURIComponent(resolvedParams.brand);
  const images = getImagesFromDirectory(`img/brands/${decodedBrand}`);

  return (
    <ProjectGallery
      name={decodedBrand}
      images={images}
      backPath="/projects"
    />
  );
}
