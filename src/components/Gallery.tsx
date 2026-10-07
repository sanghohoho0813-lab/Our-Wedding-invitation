import { Images } from "lucide-react";

import { PhotoGridBody } from "@/components/PhotoGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding, type GalleryImage } from "@/config/wedding";

/** 웨딩 화보 갤러리. */
export function Gallery() {
  const images: readonly GalleryImage[] = wedding.gallery;
  if (images.length === 0) return null;

  return (
    <section className="edge pb-24" aria-labelledby="gallery-heading">
      <SectionHeading id="gallery-heading" icon={Images} tone="gallery" title="웨딩 갤러리" />
      <PhotoGridBody images={images} />
    </section>
  );
}
