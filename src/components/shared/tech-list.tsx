import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type TechListProps = {
  items: string[];
  label: string;
  className?: string;
};

export function TechList({ items, label, className }: TechListProps) {
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li key={item}>
          <Badge variant="secondary">{item}</Badge>
        </li>
      ))}
    </ul>
  );
}
