import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RFPStatus, Priority, LogLevel } from '@/types';

interface StatusBadgeProps {
  status: RFPStatus | Priority | LogLevel;
  type?: 'status' | 'priority' | 'log';
}

const statusStyles: Record<RFPStatus, string> = {
  'New': 'bg-blue-100 text-blue-700 border-blue-200',
  'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
  'Completed': 'bg-green-100 text-green-700 border-green-200',
};

const priorityStyles: Record<Priority, string> = {
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Medium': 'bg-amber-100 text-amber-700 border-amber-200',
  'Low': 'bg-slate-100 text-slate-700 border-slate-200',
};

const logStyles: Record<LogLevel, string> = {
  'Info': 'bg-blue-100 text-blue-700 border-blue-200',
  'Success': 'bg-green-100 text-green-700 border-green-200',
  'Warning': 'bg-amber-100 text-amber-700 border-amber-200',
  'Error': 'bg-red-100 text-red-700 border-red-200',
};

export function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  const styles = type === 'priority' 
    ? priorityStyles[status as Priority] 
    : type === 'log'
    ? logStyles[status as LogLevel]
    : statusStyles[status as RFPStatus];

  return (
    <Badge 
      variant="outline" 
      className={cn('font-medium border', styles)}
    >
      {status}
    </Badge>
  );
}
