import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva("inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold leading-none", {
  variants: {
    tone: {
      success: "bg-daun-50 text-daun-800",
      warning: "bg-kunyit-50 text-kunyit-700",
      danger: "bg-cabai-50 text-cabai-700",
      info: "bg-langit-50 text-langit-700",
      neutral: "bg-tanah-100 text-tanah-700",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
