import TiltedWall from "@/components/TiltedWall";
import LightField from "@/components/LightField";
import type { WallItem } from "@/lib/types";

export default function Background({ items }: { items: WallItem[] }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <TiltedWall items={items} />
      {/* dark veil with the mouse as a light source; clicks send out a light wave */}
      <LightField />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent" />
    </div>
  );
}
