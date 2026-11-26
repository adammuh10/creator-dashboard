import Link from "next/link";
import { Card } from "../ui/Card";

export function Segera({ title, items }: { title: string; items: string[] }) {
  return (
    <>
      <h1 className="mb-4 text-[22px] font-bold sm:text-[26px]">{title}</h1>
      <Card className="max-w-xl">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-hl">Tahap berikutnya</p>
        <p className="mt-1 text-[14px]">Menu ini sedang dibangun. Isinya mengikuti wireframe:</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[13.5px] text-ink-2">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <Link href="/ringkasan" className="mt-4 inline-block rounded-xl bg-accent px-4 py-2 text-[13px] font-semibold text-on-accent">Kembali ke Ringkasan</Link>
      </Card>
    </>
  );
}
