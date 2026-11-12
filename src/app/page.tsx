import { getCategories, getProjects, getCategoryMedia } from "@/lib/content";
import { site } from "@/site.config";
import Noise from "@/components/react-bits/Noise";
import SplitText from "@/components/react-bits/SplitText";
import Background from "@/components/Background";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import Contact from "@/components/Contact";

export default function Home() {
  const categories = getCategories().map((c) => ({
    ...c,
    count: getProjects(c.slug).length,
    previews: getCategoryMedia(c.slug).slice(0, 6).map((x) => x.media),
  }));

  return (
    <>
      <Background />
      <Noise opacity={0.07} fixed />
      <Header />
      <main>
        <section className="relative mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-6">
          <SplitText
            text={site.name}
            tag="h1"
            trigger="load"
            splitType="chars"
            className="font-display text-[clamp(4rem,17vw,13rem)] font-bold leading-[0.9] tracking-tight"
          />
          <p className="mt-6 max-w-md text-lg text-muted sm:text-xl">{site.role}</p>
          <a href="#work" className="mt-14 inline-flex w-fit items-center gap-3 text-sm text-ice/70 transition-colors hover:text-ice">
            <span className="h-px w-12 bg-ice/40" /> See my work
          </a>
        </section>

        <section id="work" className="mx-auto max-w-6xl scroll-mt-10 px-6 pb-40 pt-24">
          <h2 className="mb-14 max-w-xl font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Pick a discipline.
          </h2>
          <div className="grid gap-6 pb-16 sm:grid-cols-2 sm:gap-8">
            {categories.map((c, idx) => (
              <div key={c.slug} className={idx % 2 === 1 ? "sm:translate-y-16" : ""}>
                <CategoryCard slug={c.slug} title={c.title} tagline={c.tagline} tint={c.tint ?? "#4e6bff"} count={c.count} previews={c.previews} />
              </div>
            ))}
          </div>
        </section>

        <Contact />
      </main>
    </>
  );
}
