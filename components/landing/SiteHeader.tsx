import Link from "next/link";
import { Logo } from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "#masalah", label: "Masalah" },
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#fitur", label: "Fitur" },
  { href: "#untuk-siapa", label: "Untuk siapa" },
];

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="Argha Sasya, beranda"><Logo tone="light" size="lg" /></Link>
        <nav className="hidden items-center gap-8 text-sm text-tanah-200 md:flex">
          {links.map((l) => <a key={l.href} href={l.href} className="transition-colors hover:text-white">{l.label}</a>)}
        </nav>
        <Link href="/demo" className={cn(buttonVariants({ variant: "accent", size: "sm" }))}>Coba demo</Link>
      </div>
    </header>
  );
}
