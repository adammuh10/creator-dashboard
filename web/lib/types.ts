export type Platform = "tiktok" | "instagram" | "youtube";
export type PlatformFilter = Platform | "all";
export type Period = 7 | 30 | 90;

export type Format =
  | "Video"
  | "Reels"
  | "Carousel"
  | "Foto"
  | "Shorts"
  | "Video panjang";

export interface Post {
  id: string;
  platform: Platform;
  title: string;
  topic: string;
  format: Format;
  day: number; // index hari dari awal data (0 = 90 hari lalu)
  hour: number;
  durationSec?: number;
  views: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  profileVisits: number;
  newFollowers: number;
  followersShare: number; // porsi views dari followers (0..1)
  avgWatchSec?: number;
  completion?: number; // ditonton sampai habis (0..1)
  retention?: number[]; // 21 titik, 0..1
  sources: { label: string; pct: number }[];
  impressions?: number; // YouTube
  ctr?: number; // YouTube
}

export interface Daily {
  day: number;
  platform: Platform;
  views: number;
  reach: number;
  profileVisits: number;
  linkTaps: number;
  follows: number;
  unfollows: number;
  followers: number;
  interactions: number;
}

export interface Story {
  id: string;
  day: number;
  title: string;
  views: number;
  reach: number;
  forward: number;
  back: number;
  exits: number;
  nextStory: number;
  replies: number;
  linkClicks: number;
  stickerTaps: number;
}

export interface Live {
  id: string;
  day: number;
  title: string;
  durationMin: number;
  views: number;
  uniqueViewers: number;
  peak: number;
  avgWatchMin: number;
  newFollowers: number;
  comments: number;
  gifters: number;
  diamonds: number;
}

export interface Share {
  label: string;
  pct: number;
}

export interface Audience {
  platform: Platform;
  followers: number;
  gender: Share[];
  age: Share[];
  countries: Share[];
  cities: Share[];
  active: number[][]; // 7 hari x 24 jam, 0..1
  newViewers: number; // porsi penonton baru (0..1)
  interests?: string[];
  languages?: Share[];
  subscriberWatch?: number; // YouTube: porsi waktu tonton dari subscriber
}

export interface YtRevenue {
  revenue: number;
  rpm: number;
  cpm: number;
  premium: number;
}
