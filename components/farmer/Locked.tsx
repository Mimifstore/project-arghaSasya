import Link from "next/link";
import { Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Locked({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-6 rounded-xl border border-kunyit-200 bg-kunyit-50 p-5 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-kunyit-100 text-kunyit-700"><Lock className="h-6 w-6" /></span>
      <h2 className="mt-3 text-lg font-bold">{title}</h2>
      <p className="mt-1.5 text-sm text-tanah-700">{text}</p>
      <Link href="/farmer/pelatihan" className={buttonVariants({ variant: "primary", size: "md" }) + " mt-4 w-full"}>Buka pelatihan</Link>
    </div>
  );
}
