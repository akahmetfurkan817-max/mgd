"use client";

import { useState } from "react";
import { Check, Copy, Landmark } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useIban } from "@/hooks/useSiteData";

interface DonateModalProps {
  open: boolean;
  onClose: () => void;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

export default function DonateModal({ open, onClose }: DonateModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const { data: ibanList } = useIban();

  const handleCopy = async (iban: string) => {
    const ok = await copyText(iban.replace(/\s/g, ""));
    if (ok) {
      setCopied(iban);
      window.setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Bağış Yap">
      <p className="mb-4 text-sm text-slate-600">
        Derneğimizin resmî banka hesaplarına bağış yapabilirsiniz. IBAN’ı tek tıkla kopyalayın.
      </p>
      <div className="space-y-4">
        {ibanList.map((acc) => (
          <div key={acc.iban} className="rounded-xl border border-slate-200 bg-surface p-4">
            <div className="mb-2 flex items-center gap-2 font-semibold text-primary">
              <Landmark size={18} /> {acc.bank}
            </div>
            <p className="text-xs text-slate-500">{acc.accountHolder}</p>
            <p className="mt-2 break-all font-mono text-base font-semibold tracking-wide text-ink">
              {acc.iban}
            </p>
            <button
              type="button"
              onClick={() => handleCopy(acc.iban)}
              className="btn-primary mt-3 w-full"
            >
              {copied === acc.iban ? (
                <>
                  <Check size={16} /> Kopyalandı
                </>
              ) : (
                <>
                  <Copy size={16} /> IBAN’ı Kopyala
                </>
              )}
            </button>
            {acc.note && <p className="mt-2 text-xs text-slate-500">{acc.note}</p>}
          </div>
        ))}
      </div>
    </Modal>
  );
}
