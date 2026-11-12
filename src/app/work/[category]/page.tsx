import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategory, getCategoryMedia } from "@/lib/content";
import Background from "@/components/Background";
import Header from "@/components/Header";

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const media = getCategoryMedia(category);

  return (
    <>
      <Background />
      <Header />
      <main className="mx-auto max-w-6xl px-6 pb-32 pt-36">
        <Link href="/#work" className="text-sm text-muted transition-colors hover:text-ice">← All disciplines</Link>
        <h1 className="mt-6 font-display text-[clamp(3.5rem,13vw,10rem)] font-bold leading-[0.95] tracking-tight">{cat.title}</h1>
        <p className="mt-5 max-w-xl text-lg text-muted">{cat.description}</p>

        {media.length === 0 ? (
          <p className="mt-24 rounded-3xl border border-dashed border-line p-12 text-center text-muted">
            Works are coming soon.
          </p>
        ) : (
          <div className="mt-20 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {media.map(({ media: m, project }, i) =>
              m.type === "video" ? (
                <video key={i} src={m.src} poster={m.poster} controls playsInline preload="metadata" className="w-full rounded-2xl border border-line" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={m.src} alt={m.alt || project} loading="lazy" className="w-full rounded-2xl border border-line" />
              ),
            )}
          </div>
        )}
      </main>
    </>
  );
}
