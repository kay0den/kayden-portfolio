import { getCategories } from "@/lib/content";
import { site } from "@/site.config";
import Noise from "@/components/react-bits/Noise";
import SplitText from "@/components/react-bits/SplitText";

export default function Home() {
  const categories = getCategories();
  return (
    <main className="relative mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-6 py-24">
      <Noise opacity={0.08} fixed />
      <SplitText
        text={site.name}
        tag="h1"
        trigger="load"
        splitType="chars"
        className="font-display text-[clamp(4rem,16vw,12rem)] font-bold leading-[0.9] tracking-tight"
      />
      <p className="mt-6 max-w-md text-lg text-muted">{site.role}</p>
      <ul className="mt-16 flex flex-wrap gap-3">
        {categories.map((c) => (
          <li key={c.slug} className="rounded-full border border-line px-5 py-2 text-ice">
            {c.title}
          </li>
        ))}
      </ul>
    </main>
  );
}
