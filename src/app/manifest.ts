import type { MetadataRoute } from "next";

import { wedding } from "@/config/wedding";

/** "홈 화면에 추가" 했을 때의 이름·색. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: wedding.share.title,
    short_name: `${wedding.groom.firstName} · ${wedding.bride.firstName}`,
    description: wedding.share.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#fbfaf7",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
