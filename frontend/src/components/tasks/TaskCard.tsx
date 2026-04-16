'use client';

import { Calendar, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge }       from '@/components/shared/StatusBadge';
import { formatDate, cn }    from '@/lib/utils';
import type { Task }         from '@/lib/types';

const priorityBorderMap: Record<string, string> = {
  low:      'border-l-gray-300',
  medium:   'border-l-blue-400',
  high:     'border-l-orange-400',
  critical: 'border-l-red-500',
};

// Mirrors backend transition rules exactly
const NEXT_STATUSES: Partial<Record<string, string[]>> = {
  todo:        ['in_progress'],
  in_progress: ['in_review', 'blocked'],
  in_review:   ['done', 'in_progress'],
  blocked:     ['in_progress'],
  done:        [],
};

interface TaskCardProps {
  task:           Task;
  onStatusChange: (taskId: string, newStatus: string) => void;
}

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  return (
    <Card className={cn(
      'border-l-4 shadow-sm hover:shadow-md transition-shadow',
      priorityBorderMap[task.priority] ?? 'border-l-gray-300'
    )}>
      <CardContent className='p-3 space-y-2'>

        {/* Title */}
        <p className='text-sm font-medium text-gray-800 line-clamp-2'>
          {task.title}
        </p>

        {/* Priority badge + milestone */}
        <div className='flex items-center gap-2 flex-wrap'>
          <StatusBadge status={task.priority} />
          {task.milestone && (
            <span className='text-xs text-gray-400 truncate max-w-[120px]'>
              {task.milestone.name}
            </span>
          )}
        </div>

        {/* Due date */}
        {task.due_date && (
          <div className='flex items-center gap-1 text-xs text-gray-400'>
            <Calendar className='w-3 h-3' />
            {formatDate(task.due_date)}
          </div>
        )}

        {/* Assignees */}
        {task.assignments && task.assignments.length > 0 && (
          <div className='flex items-center gap-1 text-xs text-gray-400'>
            <User className='w-3 h-3' />
            {task.assignments.map(a => a.assignee?.name).filter(Boolean).join(', ')}
          </div>
        )}

        {/* Status transition buttons (Section 4.4) */}
        {(NEXT_STATUSES[task.status] ?? []).length > 0 && (
          <div className='flex flex-wrap gap-1 pt-1 border-t border-gray-100'>
            {(NEXT_STATUSES[task.status] ?? []).map(next => (
              <button
                key={next}
                onClick={() => onStatusChange(task.id, next)}
                className='text-xs px-2 py-0.5 rounded bg-gray-100 hover:bg-brand-100
                           text-gray-600 hover:text-brand-700 transition-colors'
              >
                Move to {next.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        )}

      </CardContent>
    </Card>
  );
}