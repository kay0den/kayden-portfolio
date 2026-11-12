import { getCategories, getCategoryMedia } from "@/lib/content";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import Contact from "@/components/Contact";
import Reveal from "@/components/Reveal";

export default function Home() {
  const categories = getCategories().map((c) => {
    const media = getCategoryMedia(c.slug);
    return { ...c, count: media.length, previews: media.slice(0, 6) };
  });

  return (
    <main>
      <Hero />

      <section id="work" className="mx-auto max-w-6xl scroll-mt-10 px-6 pb-40 pt-24">
        <Reveal as="h2" className="mb-14 max-w-xl font-display text-4xl font-bold tracking-tight sm:text-6xl">
          Pick a discipline.
        </Reveal>
        <div className="grid gap-6 pb-16 sm:grid-cols-2 sm:gap-8">
          {categories.map((c, idx) => (
            <div key={c.slug} className={idx % 2 === 1 ? "sm:translate-y-16" : ""}>
              <CategoryCard slug={c.slug} title={c.title} tagline={c.tagline} tint={c.tint} count={c.count} previews={c.previews} />
            </div>
          ))}
        </div>
      </section>

      <Contact />
    </main>
  );
}
