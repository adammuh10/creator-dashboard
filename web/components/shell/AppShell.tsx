"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PrefsProvider } from "@/lib/prefs";
import { Icon } from "../ui/Icon";
import { NAV } from "./nav";
import { ThemeButton, ThemePicker } from "./ThemePicker";

const MOBILE_TABS = [
  { href: "/ringkasan", label: "Ringkasan", icon: "home" },
  { href: "/postingan", label: "Postingan", icon: "grid" },
  { href: "/saran", label: "Saran", icon: "spark", center: true },
  { href: "/audiens", label: "Audiens", icon: "users" },
];

function Sidebar({ path, onTheme }: { path: string; onTheme: () => void }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-side px-3 py-5 lg:flex">
      <Link href="/ringkasan" className="mb-6 flex items-center gap-2 px-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent text-[13px] font-bold text-on-accent">CD</span>
        <span className="text-[14px] font-bold">Creator Dashboard</span>
      </Link>
      <nav className="flex-1 space-y-5 overflow-y-auto" aria-label="Menu utama">
        {NAV.map((g) => (
          <div key={g.group}>
            <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-ink-2">{g.group}</p>
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const on = path.startsWith(it.href);
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      aria-current={on ? "page" : undefined}
                      className={`relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13.5px] transition-colors ${on ? "font-semibold text-accent" : "text-ink hover:bg-line/50"}`}
                    >
                      {on && <motion.span layoutId="side-on" className="absolute inset-0 rounded-xl bg-accent-soft" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                      <span className="relative"><Icon name={it.icon} /></span>
                      <span className="relative flex-1">{it.label}</span>
                      {!it.ready && <span className="relative rounded-md bg-line px-1.5 py-0.5 text-[10px] font-semibold text-ink-2">segera</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-line bg-card p-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-hl-soft text-[13px] font-bold text-hl">S</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold">Sarita</p>
          <p className="text-[11px] text-ink-2">Mode demo</p>
        </div>
        <ThemeButton onClick={onTheme} />
      </div>
    </aside>
  );
}

function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    ref.current?.focus();
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center">
          <motion.div className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={ref}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative max-h-[85dvh] w-full overflow-y-auto rounded-t-3xl border-t border-line bg-card p-5 pb-8 outline-none lg:w-[440px] lg:rounded-3xl lg:border lg:pb-6 lg:shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line lg:hidden" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[16px] font-bold">{title}</h2>
              <button onClick={onClose} aria-label="Tutup" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-line/50">
                <Icon name="x" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function MobileNav({ path, onMenu }: { path: string; onMenu: () => void }) {
  return (
    <nav aria-label="Menu bawah" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="grid grid-cols-5 items-end">
        {MOBILE_TABS.map((t) => {
          const on = path.startsWith(t.href);
          return (
            <li key={t.href} className="flex justify-center">
              <Link href={t.href} aria-current={on ? "page" : undefined} className={`flex flex-col items-center gap-0.5 py-2 text-[10.5px] ${on ? "font-semibold text-accent" : "text-ink-2"}`}>
                {t.center ? (
                  <span className={`-mt-5 grid h-12 w-12 place-items-center rounded-full shadow-lg ${on ? "bg-accent text-on-accent" : "bg-ink text-page"}`}>
                    <Icon name={t.icon} className="h-5 w-5" />
                  </span>
                ) : (
                  <Icon name={t.icon} className="h-5 w-5" />
                )}
                {t.label}
              </Link>
            </li>
          );
        })}
        <li className="flex justify-center">
          <button onClick={onMenu} className="flex flex-col items-center gap-0.5 py-2 text-[10.5px] text-ink-2">
            <Icon name="menu" className="h-5 w-5" />
            Menu
          </button>
        </li>
      </ul>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname() ?? "";
  const [themeOpen, setThemeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [path]);

  return (
    <PrefsProvider>
      <div className="flex min-h-dvh">
        <Sidebar path={path} onTheme={() => setThemeOpen(true)} />
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-page/90 px-4 py-2.5 backdrop-blur lg:hidden">
            <Link href="/ringkasan" className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-[11px] font-bold text-on-accent">CD</span>
              <span className="text-[14px] font-bold">Creator Dashboard</span>
            </Link>
            <ThemeButton onClick={() => setThemeOpen(true)} />
          </header>
          <main className="mx-auto w-full max-w-[1240px] px-4 pb-28 pt-4 sm:px-6 lg:px-8 lg:pb-12 lg:pt-7">{children}</main>
        </div>
      </div>
      <MobileNav path={path} onMenu={() => setMenuOpen(true)} />
      <Sheet open={themeOpen} onClose={() => setThemeOpen(false)} title="Tampilan">
        <ThemePicker />
      </Sheet>
      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu">
        <div className="space-y-4">
          {NAV.map((g) => (
            <div key={g.group}>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-2">{g.group}</p>
              <ul className="grid grid-cols-2 gap-2">
                {g.items.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[13px] ${path.startsWith(it.href) ? "border-accent bg-accent-soft font-semibold text-accent" : "border-line"}`}>
                      <Icon name={it.icon} />
                      <span className="flex-1">{it.label}</span>
                      {!it.ready && <span className="text-[10px] text-ink-2">segera</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="border-t border-line pt-4">
            <ThemePicker />
          </div>
        </div>
      </Sheet>
    </PrefsProvider>
  );
}
