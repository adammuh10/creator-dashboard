import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Creator Dashboard", template: "%s · Creator Dashboard" },
  description: "Performa TikTok, Instagram, dan YouTube, saran mingguan, dan urusan kerja sama di satu tempat.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
};

// Pasang tema sebelum halaman tampil, supaya tidak berkedip.
const themeScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("cd-theme")||"krem";var m=localStorage.getItem("cd-mode")||"sistem";if(m==="sistem")m=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.setAttribute("data-theme",t);d.setAttribute("data-mode",m)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" data-theme="krem" data-mode="light" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
