import type { DraftStatus } from "@/config/wedding";

const LABEL: Record<DraftStatus, string> = {
  example: "예시",
  "needs-confirmation": "확인 필요",
};

/**
 * 아직 확정되지 않은 내용임을 알려주는 작은 표시.
 * config 의 draft 값을 지우면 화면에서도 사라진다.
 */
export function DraftMark({ status, className = "" }: { status?: DraftStatus; className?: string }) {
  if (!status) return null;

  return (
    <span className={`draft-mark ${className}`.trim()}>[{LABEL[status]}]</span>
  );
}
