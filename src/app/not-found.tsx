import Link from "next/link";

import { wedding } from "@/config/wedding";

/** 잘못된 주소로 들어왔을 때 — 청첩장과 같은 톤으로 안내한다. */
export default function NotFound() {
  return (
    <main className="shell edge flex min-h-[100svh] flex-col items-center justify-center text-center">
      <p className="latin text-[13px] tracking-[0.24em] text-faint">404</p>
      <p className="serif mt-6 text-[19px] tracking-[0.02em] text-ink">
        {wedding.groom.name}
        <span className="mx-2.5 text-[12px] text-faint">×</span>
        {wedding.bride.name}
      </p>
      <p className="mt-5 text-[14.5px] leading-relaxed text-muted">
        찾으시는 페이지가 없습니다.
        <br />
        청첩장은 아래에서 열어보실 수 있습니다.
      </p>
      <Link href="/" className="btn-outline mt-9 min-w-[180px] active:bg-paper-deep">
        청첩장 열기
      </Link>
    </main>
  );
}
