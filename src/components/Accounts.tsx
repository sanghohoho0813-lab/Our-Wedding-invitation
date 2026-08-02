"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useToast } from "@/components/Toast";
import { wedding, type Account } from "@/config/wedding";
import { copyText } from "@/lib/clipboard";

function AccountRow({ account }: { account: Account }) {
  const { showToast } = useToast();

  const handleCopy = async () => {
    const ok = await copyText(account.number.replace(/\s/g, ""));
    showToast(ok ? "계좌번호가 복사되었습니다." : "복사에 실패했습니다.");
  };

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="text-[12.5px] tracking-[0.02em] text-faint">
          {account.relation ? `${account.relation} · ` : ""}
          {account.holder}
        </p>
        <p className="mt-1.5 text-[14.5px] tracking-[-0.01em] text-[#4a473f]">
          {account.bank} {account.number}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`${account.holder} ${account.bank} 계좌번호 복사`}
        className="tap shrink-0 rounded-[6px] border border-line px-3.5 text-[12.5px] text-muted active:bg-paper-deep"
      >
        복사
      </button>
    </div>
  );
}

/** 레퍼런스처럼 "신랑측 / 신부측" 드롭다운 두 개만 노출한다. */
function AccountGroup({ title, accounts }: { title: string; accounts: readonly Account[] }) {
  const [open, setOpen] = useState(false);
  if (accounts.length === 0) return null;

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-[15px] tracking-[-0.01em] text-ink">{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-faint"
          aria-hidden="true"
        >
          <ChevronDown size={17} strokeWidth={1.5} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-line border-t border-line px-5 pb-2">
              {accounts.map((account, i) => (
                <AccountRow key={i} account={account} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Accounts() {
  const { heading, body, groom, bride } = wedding.accounts;

  return (
    <section className="edge pb-24" aria-labelledby="accounts-heading">
      <SectionHeading title={heading} body={body} />

      <Reveal delay={0.06}>
        <div className="mt-9 space-y-2.5">
          <AccountGroup title="신랑측" accounts={groom} />
          <AccountGroup title="신부측" accounts={bride} />
        </div>
      </Reveal>
    </section>
  );
}
