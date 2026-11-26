"use client";
import { useState, type ReactNode } from "react";
import { Card, CardHead } from "../ui/Card";
import { Segmented } from "../ui/Segmented";

/** Kartu grafik dengan pilihan Grafik / Tabel (supaya angka bisa dibaca tanpa warna). */
export function ChartCard({
  title,
  sub,
  table,
  children,
  className = "",
  right,
}: {
  title: string;
  sub?: string;
  table?: { columns: string[]; rows: (string | number)[][] };
  children: ReactNode;
  className?: string;
  right?: ReactNode;
}) {
  const [view, setView] = useState<"g" | "t">("g");
  return (
    <Card className={className}>
      <CardHead
        title={title}
        sub={sub}
        right={
          <div className="flex items-center gap-2">
            {right}
            {table && (
              <Segmented
                size="sm"
                label={`Tampilan ${title}`}
                value={view}
                onChange={setView}
                options={[
                  { value: "g", label: "Grafik" },
                  { value: "t", label: "Tabel" },
                ]}
              />
            )}
          </div>
        }
      />
      {view === "g" || !table ? (
        children
      ) : (
        <div className="scroll-x max-h-72 overflow-y-auto">
          <table className="w-full text-[12.5px]">
            <thead className="sticky top-0 bg-card">
              <tr>
                {table.columns.map((c, i) => (
                  <th key={c} className={`border-b border-line px-2 py-1.5 font-medium text-ink-2 ${i ? "text-right" : "text-left"}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((r, ri) => (
                <tr key={ri} className="odd:bg-page/40">
                  {r.map((v, i) => (
                    <td key={i} className={`px-2 py-1.5 ${i ? "tnum text-right" : ""}`}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
