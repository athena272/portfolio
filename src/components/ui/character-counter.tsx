import { cn } from "@/lib/cn";

/** From this share of the limit on, the counter turns into a warning. */
const WARNING_RATIO = 0.9;

export type CharacterCountTone = "default" | "warning" | "limit";

export function getCharacterCountTone(count: number, max: number): CharacterCountTone {
  if (count >= max) return "limit";
  if (count >= max * WARNING_RATIO) return "warning";
  return "default";
}

const TONE_CLASS_NAMES: Record<CharacterCountTone, string> = {
  default: "border-primary/25 bg-accent text-accent-foreground",
  warning: "border-warning/40 bg-warning/10 text-warning",
  limit: "border-destructive/40 bg-destructive/10 text-destructive",
};

type CharacterCounterProps = {
  id: string;
  count: number;
  max: number;
  /** Full sentence for screen readers, such as "12 of 100 characters". */
  label: string;
  className?: string;
};

/** Pill with "count/max". Link it to its field with `aria-describedby` so it is read on focus. */
export function CharacterCounter({ id, count, max, label, className }: CharacterCounterProps) {
  const tone = getCharacterCountTone(count, max);

  return (
    <p
      id={id}
      data-tone={tone}
      className={cn(
        "shrink-0 rounded-full border px-2.5 py-1 text-xs leading-none font-semibold tabular-nums transition-colors",
        TONE_CLASS_NAMES[tone],
        className,
      )}
    >
      <span aria-hidden="true">
        {count}/{max}
      </span>
      <span className="sr-only">{label}</span>
    </p>
  );
}
