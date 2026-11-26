import type { Platform } from "./types";

export const PLATFORMS: Platform[] = ["tiktok", "instagram", "youtube"];

export const PLATFORM_LABEL: Record<Platform, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
};

// Warna data tetap (sudah divalidasi untuk buta warna), tidak ikut tema.
export const PLATFORM_COLOR: Record<Platform, string> = {
  tiktok: "var(--s-tiktok)",
  instagram: "var(--s-instagram)",
  youtube: "var(--s-youtube)",
};
