export type Media =
  | { type: "image"; src: string; alt: string; width: number; height: number }
  | { type: "video"; src: string; poster?: string; alt: string }
  | { type: "embed"; provider: "youtube"; id: string; alt: string; thumb: string };

export interface Category {
  slug: string; // folder name inside public/work = URL segment
  title: string;
  tagline: string;
  description: string;
  order: number;
  tint: string;
}

export interface WallItem {
  src?: string;
  tint: string;
}
