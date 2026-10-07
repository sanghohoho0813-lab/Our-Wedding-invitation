import type { Metadata } from "next";
import { Nanum_Gothic_Coding } from "next/font/google";

import { DevInvitation } from "@/components/dev/DevInvitation";
import { wedding } from "@/config/wedding";

/** 한글까지 고르게 맞는 코딩용 글꼴 — 이 페이지에서만 내려받는다. */
const coding = Nanum_Gothic_Coding({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-coding",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: `${wedding.groom.name} ♥ ${wedding.bride.name} — 개발자의 청첩장`,
  description: "git merge --no-ff groom bride",
};

/** 개발자 버전 청첩장 — sh-jy-wedding.app/dev */
export default function DevPage() {
  return (
    <div className={coding.variable}>
      <DevInvitation />
    </div>
  );
}
