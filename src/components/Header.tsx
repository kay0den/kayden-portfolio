import Link from "next/link";
import { site } from "@/site.config";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10">
      <Link href="/" className="font-display text-lg font-bold tracking-wide">
        {site.name}
      </Link>
      <nav className="flex gap-6 text-sm text-muted">
        <Link href="/#work" className="transition-colors hover:text-ice">Work</Link>
        <Link href="/#contact" className="transition-colors hover:text-ice">Contact</Link>
      </nav>
    </header>
  );
}
