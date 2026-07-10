import { ImageGrid } from "@/components/ImageGrid";
import { getImagesFromDirectory } from "@/lib/images";

export const dynamic = 'force-dynamic';

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const resolvedParams = await params;
  const decodedBrand = decodeURIComponent(resolvedParams.brand);
  const images = getImagesFromDirectory(`img/brands/${decodedBrand}`);

  return (
    <div className="w-full">
      <h1 className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-8">{decodedBrand}</h1>
      <ImageGrid images={images} />
    </div>
  );
}
