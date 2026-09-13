/**
 * ─────────────────────────────────────────────────────────────
 *  자리표시(placeholder) 정보 방어
 * ─────────────────────────────────────────────────────────────
 *  아직 실제 값이 들어오지 않은 전화번호 · 계좌번호를 하객이 눌렀을 때
 *  엉뚱한 곳으로 전화가 걸리거나 0 으로 가득한 계좌가 복사되는 일을 막는다.
 *
 *  실제 값이 config 에 들어오면 아무것도 하지 않아도 자동으로 다시 활성화된다.
 * ─────────────────────────────────────────────────────────────
 */

/** 숫자가 모두 0 이거나 비어 있으면 아직 넣지 않은 번호로 본다. */
export function isPlaceholderPhone(phone: string | undefined) {
  if (!phone) return true;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9) return true;
  // 010-0000-0000 처럼 국번 이후가 전부 0 인 경우
  return /^0+$/.test(digits.slice(3));
}

/** 계좌번호 또는 은행명이 아직 예시값이면 true */
export function isPlaceholderAccount(account: { bank: string; number: string }) {
  const digits = account.number.replace(/\D/g, "");
  if (digits.length === 0) return true;
  if (/^0+$/.test(digits)) return true;
  return account.bank.trim() === "은행명" || account.bank.trim() === "";
}

/** 아직 정보가 없을 때 화면에 보여줄 문구 */
export const PLACEHOLDER_LABEL = "[정보 입력 예정]";
