import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategory, getCategoryMedia } from "@/lib/content";
import CategoryGallery from "@/components/CategoryGallery";
import Reveal from "@/components/Reveal";
import WordReveal, { DrawLine } from "@/components/WordReveal";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const media = getCategoryMedia(category);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-32 pt-36">
      <Link href="/#work" className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ice">
        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> All disciplines
      </Link>
      <WordReveal as="h1" text={cat.title} className="mt-6 font-display text-[clamp(3.5rem,13vw,10rem)] font-bold leading-[0.95] tracking-tight" />
      <Reveal as="p" delay={0.12} className="mt-5 max-w-xl text-lg text-muted">
        {cat.description}
      </Reveal>

      <DrawLine className="mt-12" />
      <div className="mt-16">
        {media.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-line p-12 text-center text-muted">Works are coming soon.</p>
        ) : (
          <CategoryGallery media={media} />
        )}
      </div>
    </main>
  );
}
