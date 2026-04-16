import { TaskCard } from './TaskCard';
import { cn }       from '@/lib/utils';
import type { Task, TaskStatus } from '@/lib/types';

const COLUMN_STYLES: Record<TaskStatus, { header: string; dot: string }> = {
  todo:        { header: 'bg-gray-100   text-gray-600',   dot: 'bg-gray-400'   },
  in_progress: { header: 'bg-blue-50    text-blue-700',   dot: 'bg-blue-500'   },
  in_review:   { header: 'bg-purple-50  text-purple-700', dot: 'bg-purple-500' },
  done:        { header: 'bg-green-50   text-green-700',  dot: 'bg-green-500'  },
  blocked:     { header: 'bg-red-50     text-red-700',    dot: 'bg-red-500'    },
};

const COLUMN_LABELS: Record<TaskStatus, string> = {
  todo:        'To Do',
  in_progress: 'In Progress',
  in_review:   'In Review',
  done:        'Done',
  blocked:     'Blocked',
};

interface TaskColumnProps {
  status:         TaskStatus;
  tasks:          Task[];
  onStatusChange: (taskId: string, newStatus: string) => void;
}

export function TaskColumn({ status, tasks, onStatusChange }: TaskColumnProps) {
  const style = COLUMN_STYLES[status];

  return (
    <div className='flex flex-col min-w-[240px] max-w-[280px]'>

      {/* Column header */}
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg mb-2',
        style.header
      )}>
        <span className={cn('w-2 h-2 rounded-full', style.dot)} />
        <span className='text-sm font-medium'>{COLUMN_LABELS[status]}</span>
        <span className='ml-auto text-xs opacity-70'>{tasks.length}</span>
      </div>

      {/* Task cards */}
      <div className='flex flex-col gap-2 min-h-[120px]'>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
          />
        ))}
        {tasks.length === 0 && (
          <div className='rounded-lg border-2 border-dashed border-gray-100
                          flex items-center justify-center h-20'>
            <p className='text-xs text-gray-300'>No tasks</p>
          </div>
        )}
      </div>

    </div>
  );
}