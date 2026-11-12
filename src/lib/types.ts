export type Media =
  | { type: "image"; src: string; alt: string; width?: number; height?: number }
  | { type: "video"; src: string; poster?: string; alt: string };

export type VideoEmbed = { provider: "file" | "youtube" | "vimeo"; src: string; poster?: string };

export interface Category {
  slug: string;          // folder name = URL segment
  title: string;
  tagline: string;
  description: string;
  order: number;
  tint?: string;         // optional per-category colour (hex)
  cover?: Media;
}

export interface Project {
  slug: string;
  category: string;
  title: string;
  summary: string;
  year: number;
  role?: string;
  cover?: Media;
  description: string;
  gallery: Media[];
  video?: VideoEmbed;
  breakdown: { heading: string; body: string }[];
  tools: string[];
  featured?: boolean;
}
