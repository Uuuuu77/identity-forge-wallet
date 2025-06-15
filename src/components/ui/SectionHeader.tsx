
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export const SectionHeader = ({ title, description, className }: SectionHeaderProps) => (
  <div className={cn("mb-6", className)}>
    <h2 className="text-xl font-semibold text-violet-300">{title}</h2>
    {description && (
      <p className="text-gray-400 mt-1">{description}</p>
    )}
  </div>
);
