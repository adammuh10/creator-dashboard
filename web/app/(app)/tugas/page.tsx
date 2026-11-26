import { Segera } from "@/components/views/Segera";
export const metadata = { title: "Tugas" };
export default function Page() {
  return <Segera title="Tugas" items={["Hari ini, papan per tahap, kalender bulanan", "Tugas otomatis mundur dari tanggal terbit", "Seret ide ke tanggal di jam terbaik"]} />;
}
