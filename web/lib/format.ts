const nf = new Intl.NumberFormat("id-ID");
const nf1 = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

export const num = (n: number) => nf.format(Math.round(n));

export function compact(n: number) {
  const a = Math.abs(n);
  if (a >= 1e6) return `${nf1.format(n / 1e6)} jt`;
  if (a >= 1e4) return `${nf1.format(n / 1e3)} rb`;
  return nf.format(Math.round(n));
}

export const pct = (x: number, digits = 1) =>
  `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: digits }).format(x * 100)}%`;

/** Persen tanpa desimal, kecuali di bawah 1% (supaya tidak tampil "0%"). */
export const pctSmart = (x: number) => pct(x, x > 0 && x < 0.01 ? 1 : 0);

export const rupiah = (n: number) => `Rp${nf.format(Math.round(n))}`;

export function duration(sec: number) {
  if (sec < 60) return `${Math.round(sec)} dtk`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return s ? `${m} mnt ${s} dtk` : `${m} mnt`;
}

export function delta(cur: number, prev: number) {
  if (!prev) return 0;
  return (cur - prev) / prev;
}

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
export const HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
export const HARI_PANJANG = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export const shortDate = (d: Date) => `${d.getUTCDate()} ${BULAN[d.getUTCMonth()]}`;
