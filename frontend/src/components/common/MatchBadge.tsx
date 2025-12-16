import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MatchBadgeProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
}

export function MatchBadge({ percentage, size = 'md' }: MatchBadgeProps) {
  const getColor = () => {
    if (percentage >= 90) return 'bg-green-100 text-green-700 border-green-200';
    if (percentage >= 80) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  return (
    <Badge
      variant="outline"
      className={cn('font-semibold border', getColor(), sizeClasses[size])}
    >
      {percentage}%
    </Badge>
  );
}
