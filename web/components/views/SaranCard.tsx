"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Saran } from "@/lib/insights";

export function SaranCard({ s, i, compact = false, done, onDone }: { s: Saran; i: number; compact?: boolean; done?: boolean; onDone?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06, layout: { type: "spring", stiffness: 400, damping: 36 } }}
      className={`rounded-xl border p-3 ${done ? "border-line bg-page/50" : "border-line bg-card"}`}
    >
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full text-left">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[10.5px] font-semibold text-accent">{s.kategori}</span>
          {s.dampak === "Tinggi" && <span className="rounded-md bg-hl-soft px-1.5 py-0.5 text-[10.5px] font-semibold text-hl">Dampak tinggi</span>}
          <span className="ml-auto text-[11px] text-ink-2">{open ? "Tutup" : "Detail"}</span>
        </div>
        <h3 className={`text-[14px] font-semibold leading-snug ${done ? "text-ink-2 line-through" : ""}`}>{s.judul}</h3>
        {!compact && <p className="mt-1 text-[12.5px] text-ink-2">{s.alasan}</p>}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {compact && <p className="mt-1 text-[12.5px] text-ink-2">{s.alasan}</p>}
            <dl className="mt-2 space-y-1 rounded-lg bg-page/60 p-2 text-[12px]">
              {s.bukti.map((b) => (
                <div key={b.label} className="flex justify-between gap-3">
                  <dt className="text-ink-2">{b.label}</dt>
                  <dd className="tnum shrink-0 font-semibold">{b.nilai}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-[12.5px]">
              <span className="font-semibold">Lakukan: </span>
              {s.aksi}
            </p>
            {onDone && (
              <button onClick={onDone} className={`mt-2 rounded-lg px-3 py-1.5 text-[12px] font-semibold ${done ? "border border-line" : "bg-accent text-on-accent"}`}>
                {done ? "Batalkan tanda" : "Tandai sudah dilakukan"}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
