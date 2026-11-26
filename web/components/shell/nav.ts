export interface NavItem {
  href: string;
  label: string;
  icon: string;
  ready: boolean;
}

export const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Analitik",
    items: [
      { href: "/ringkasan", label: "Ringkasan", icon: "home", ready: true },
      { href: "/saran", label: "Saran AI", icon: "spark", ready: true },
      { href: "/postingan", label: "Postingan", icon: "grid", ready: true },
      { href: "/audiens", label: "Audiens", icon: "users", ready: true },
    ],
  },
  {
    group: "Kerja",
    items: [
      { href: "/tugas", label: "Tugas", icon: "check", ready: false },
      { href: "/ide", label: "Ide & Tren", icon: "bulb", ready: false },
      { href: "/cuan", label: "Cuan", icon: "wallet", ready: false },
    ],
  },
  {
    group: "Lainnya",
    items: [
      { href: "/laporan", label: "Laporan", icon: "file", ready: false },
      { href: "/impor", label: "Impor data", icon: "upload", ready: false },
      { href: "/akun", label: "Akun", icon: "user", ready: false },
    ],
  },
];
