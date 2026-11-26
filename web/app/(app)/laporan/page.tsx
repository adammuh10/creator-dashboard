import { Segera } from "@/components/views/Segera";
export const metadata = { title: "Laporan" };
export default function Page() {
  return <Segera title="Laporan" items={["Laporan mingguan dan bulanan", "Unduh PDF"]} />;
}
