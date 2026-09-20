import { PhotoGrid } from "@/components/PhotoGrid";
import { wedding, type GalleryImage } from "@/config/wedding";

/** 웨딩 화보 갤러리. */
export function Gallery() {
  const images: readonly GalleryImage[] = wedding.gallery;
  return <PhotoGrid id="gallery" title="웨딩 갤러리" images={images} />;
}
