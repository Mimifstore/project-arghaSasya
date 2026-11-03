import * as React from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-lg border border-tanah-200 bg-white px-3 text-sm text-tanah-900 placeholder:text-tanah-400 transition-colors hover:border-tanah-300 focus:border-daun-500";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, ref) => (
  <input ref={ref} className={cn(control, "h-11", className)} {...p} />
));
Input.displayName = "Input";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...p }, ref) => (
  <select ref={ref} className={cn(control, "h-11", className)} {...p}>{children}</select>
));
Select.displayName = "Select";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...p }, ref) => (
  <textarea ref={ref} className={cn(control, "min-h-24 py-2.5", className)} {...p} />
));
Textarea.displayName = "Textarea";

export function Field({ label, hint, className, children }: { label: string; hint?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-tanah-800">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-tanah-500">{hint}</span>}
    </label>
  );
}
