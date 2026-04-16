import { CheckCircle2, Circle, Calendar } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { Milestone } from '@/lib/types';

interface MilestoneProgressProps { milestones: Milestone[]; }

export function MilestoneProgress({ milestones }: MilestoneProgressProps) {
  const completed = milestones.filter(m => m.is_completed).length;
  const percent   = milestones.length ? Math.round((completed / milestones.length) * 100) : 0;

  return (
    <div className='space-y-4'>
      <div>
        <div className='flex justify-between text-sm mb-1'>
          <span className='font-medium text-gray-700'>Milestone Progress</span>
          <span className='text-gray-500'>{completed}/{milestones.length} complete</span>
        </div>
        <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
          <div
            className='h-full bg-brand-600 rounded-full transition-all duration-500'
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <ul className='space-y-2'>
        {milestones.map(m => (
          <li key={m.id} className='flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100'>
            {m.is_completed
              ? <CheckCircle2 className='w-4 h-4 text-green-500 shrink-0' />
              : <Circle className='w-4 h-4 text-gray-300 shrink-0' />}
            <span className={cn('text-sm flex-1', m.is_completed ? 'text-gray-400 line-through' : 'text-gray-700')}>
              {m.name}
            </span>
            <span className='text-xs text-gray-400 flex items-center gap-1'>
              <Calendar className='w-3 h-3' /> {formatDate(m.due_date)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}