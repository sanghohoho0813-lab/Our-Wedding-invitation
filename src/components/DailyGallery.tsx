import { PhotoGrid } from "@/components/PhotoGrid";
import { wedding, type GalleryImage } from "@/config/wedding";

/** 우리의 일상 — 연애하며 휴대폰으로 찍은 사진들. */
export function DailyGallery() {
  const { dailyGallery } = wedding;
  const images: readonly GalleryImage[] = dailyGallery.images;
  if (!dailyGallery.enabled) return null;

  return (
    <PhotoGrid
      id="daily"
      title={dailyGallery.heading}
      body={dailyGallery.body}
      images={images}
    />
  );
}
