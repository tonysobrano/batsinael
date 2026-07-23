import { SelectedGallery } from "@/components/SelectedGallery";
import { getSelectedGalleryItems } from "@/lib/images";

export default function Home() {
  return <SelectedGallery items={getSelectedGalleryItems()} />;
}
