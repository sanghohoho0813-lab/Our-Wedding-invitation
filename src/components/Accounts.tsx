"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/Reveal";
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
        <p className="text-[12px] tracking-[0.02em] text-faint">
          {account.relation ? `${account.relation} · ` : ""}
          {account.holder}
        </p>
        <p className="mt-1.5 text-[14.5px] tracking-[-0.01em] text-[#3d3b37]">
          {account.bank} {account.number}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`${account.holder} ${account.bank} 계좌번호 복사`}
        className="tap shrink-0 border border-line px-3.5 text-[12.5px] text-muted transition-colors active:bg-paper-deep"
      >
        복사
      </button>
    </div>
  );
}

function AccountGroup({ title, accounts }: { title: string; accounts: readonly Account[] }) {
  const [open, setOpen] = useState(false);
  if (accounts.length === 0) return null;

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[14.5px] tracking-[-0.01em] text-ink">{title}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-faint"
          aria-hidden="true"
        >
          <Plus size={15} strokeWidth={1.4} />
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
            <div className="divide-y divide-line/70 pb-3">
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
  const { groom, bride } = wedding.accounts;

  return (
    <section className="edge pb-28" aria-labelledby="accounts-heading">
      <Reveal>
        <div className="text-center">
          <p id="accounts-heading" className="eyebrow">
            With Heart
          </p>
          <p className="mt-7 text-[15px] leading-[1.9] tracking-[-0.01em] text-muted">
            축하의 마음을 전하고 싶은 분들을 위해
            <br />
            계좌번호를 안내드립니다.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-10 border-t border-line">
          <AccountGroup title="신랑측 마음 전하실 곳" accounts={groom} />
          <AccountGroup title="신부측 마음 전하실 곳" accounts={bride} />
        </div>
      </Reveal>
    </section>
  );
}
