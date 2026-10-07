import type { Metadata } from "next";

import { MessagesInbox } from "@/components/MessagesInbox";

export const metadata: Metadata = {
  title: "축하 메시지 모아보기",
  robots: { index: false, follow: false },
};

/** 신랑 · 신부 전용 — 하객이 남긴 축하 메시지를 모아 본다. */
export default function MessagesPage() {
  return <MessagesInbox />;
}
