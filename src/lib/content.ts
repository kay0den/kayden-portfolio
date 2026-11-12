import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import type { Category, Media, WallItem } from "./types";

/**
 * Content lives in public/work/<category>/ :
 *   category.json  -> title, tagline, description, order, tint, (optional) videos
 *   any image/video files dropped next to it are picked up automatically.
 */
const ROOT = path.join(process.cwd(), "public/work");
const IMG = /\.(jpe?g|png|webp|avif|gif)$/i;
const VID = /\.(mp4|webm|m4v|mov)$/i;
const POSTER = /\.poster\.(jpe?g|png|webp)$/i;

interface CategoryFile {
  title?: string;
  tagline?: string;
  description?: string;
  order?: number;
  tint?: string;
  videos?: { youtube: string; title?: string }[];
}

const natural = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
const url = (slug: string, file: string) => encodeURI(`/work/${slug}/${file}`);
const humanize = (file: string) =>
  file.replace(/\.[^.]+$/, "").replace(/^\d+[-_.\s]*/, "").replace(/[-_]+/g, " ").trim() || "Artwork";

function readJson(slug: string): CategoryFile {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, slug, "category.json"), "utf8")) as CategoryFile;
  } catch {
    return {};
  }
}

function dims(file: string): { width: number; height: number } {
  try {
    const fd = fs.openSync(file, "r");
    const size = Math.min(fs.fstatSync(fd).size, 512 * 1024);
    const buf = Buffer.alloc(size);
    fs.readSync(fd, buf, 0, size, 0);
    fs.closeSync(fd);
    const r = imageSize(buf);
    return { width: r.width || 1600, height: r.height || 1000 };
  } catch {
    return { width: 1600, height: 1000 };
  }
}

export function getCategories(): Category[] {
  if (!fs.existsSync(ROOT)) return [];
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, d.name, "category.json")))
    .map((d, i) => {
      const j = readJson(d.name);
      return {
        slug: d.name,
        title: j.title ?? d.name,
        tagline: j.tagline ?? "",
        description: j.description ?? "",
        order: j.order ?? 100 + i,
        tint: j.tint ?? "#4e6bff",
      };
    })
    .sort((a, b) => a.order - b.order || natural(a.title, b.title));
}

export const getCategory = (slug: string) => getCategories().find((c) => c.slug === slug);

export function getCategoryMedia(slug: string): Media[] {
  const dir = path.join(ROOT, slug);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).sort(natural);
  const out: Media[] = [];

  for (const f of files) {
    if (POSTER.test(f)) continue;
    if (IMG.test(f)) {
      out.push({ type: "image", src: url(slug, f), alt: humanize(f), ...dims(path.join(dir, f)) });
    } else if (VID.test(f)) {
      const base = f.replace(/\.[^.]+$/, "");
      const poster = files.find((x) => x.toLowerCase().startsWith(`${base.toLowerCase()}.poster.`));
      out.push({ type: "video", src: url(slug, f), poster: poster ? url(slug, poster) : undefined, alt: humanize(f) });
    }
  }
  for (const v of readJson(slug).videos ?? []) {
    out.push({
      type: "embed",
      provider: "youtube",
      id: v.youtube,
      alt: v.title ?? "Video",
      thumb: `https://i.ytimg.com/vi/${v.youtube}/hqdefault.jpg`,
    });
  }
  return out;
}

/** Images from every category, interleaved, for the animated background wall. */
export function getWallItems(max = 36): WallItem[] {
  const cats = getCategories();
  const lists = cats.map((c) =>
    getCategoryMedia(c.slug)
      .filter((m): m is Extract<Media, { type: "image" }> => m.type === "image")
      .map((m) => ({ src: m.src, tint: c.tint })),
  );
  const items: WallItem[] = [];
  for (let i = 0; items.length < max; i++) {
    let added = false;
    for (const l of lists) if (l[i] && items.length < max) { items.push(l[i]); added = true; }
    if (!added) break;
  }
  return items.length ? items : cats.map((c) => ({ tint: c.tint }));
}
