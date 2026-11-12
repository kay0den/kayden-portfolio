import fs from "node:fs";
import path from "node:path";
import type { Category, Project } from "./types";

const ROOT = path.join(process.cwd(), "src/content/categories");
const readJson = <T,>(file: string): T => JSON.parse(fs.readFileSync(file, "utf8")) as T;

/** Every folder in src/content/categories with a category.json is a category. */
export function getCategories(): Category[] {
  if (!fs.existsSync(ROOT)) return [];
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, d.name, "category.json")))
    .map((d) => ({ slug: d.name, ...readJson<Omit<Category, "slug">>(path.join(ROOT, d.name, "category.json")) }))
    .sort((a, b) => a.order - b.order);
}

export const getCategory = (slug: string) => getCategories().find((c) => c.slug === slug);

export function getProjects(category: string): Project[] {
  const dir = path.join(ROOT, category, "projects");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({
      slug: f.replace(/\.json$/, ""),
      category,
      ...readJson<Omit<Project, "slug" | "category">>(path.join(dir, f)),
    }))
    .sort((a, b) => b.year - a.year);
}

export const getProject = (category: string, slug: string) =>
  getProjects(category).find((p) => p.slug === slug);

export const getAllProjects = () => getCategories().flatMap((c) => getProjects(c.slug));

/** Same category first, then featured from others. */
export function getRelated(project: Project, limit = 3): Project[] {
  const others = getAllProjects().filter((p) => !(p.category === project.category && p.slug === project.slug));
  return others
    .sort((a, b) => Number(b.category === project.category) - Number(a.category === project.category))
    .slice(0, limit);
}

export interface CategoryMedia { media: import("./types").Media; project: string }

/** All images/videos of a category (covers + galleries), for previews and galleries. */
export function getCategoryMedia(slug: string): CategoryMedia[] {
  const cat = getCategory(slug);
  const out: CategoryMedia[] = [];
  if (cat?.cover) out.push({ media: cat.cover, project: cat.title });
  for (const p of getProjects(slug)) {
    if (p.cover) out.push({ media: p.cover, project: p.title });
    for (const m of p.gallery) out.push({ media: m, project: p.title });
  }
  return out;
}
