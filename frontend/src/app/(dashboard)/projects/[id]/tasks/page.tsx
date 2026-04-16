'use client';

import { use }            from 'react';
import Link               from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button }          from '@/components/ui/button';
import { LoadingSpinner }  from '@/components/shared/LoadingSpinner';
import { TaskColumn }      from '@/components/tasks/TaskColumn';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient }       from '@/lib/api';
import type { Task, TaskStatus } from '@/lib/types';

const ALL_STATUSES: TaskStatus[] = [
  'todo', 'in_progress', 'in_review', 'done', 'blocked',
];

export default function TaskBoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', projectId],
    queryFn:  async () => {
      const { data } = await apiClient.get(
        `/projects/${projectId}/tasks?limit=100`
      );
      return data.data;
    },
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      apiClient.patch(`/tasks/${taskId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateStatus({ taskId, status: newStatus });
  };

  // Group tasks by status column
  const tasksByStatus = ALL_STATUSES.reduce<Record<TaskStatus, Task[]>>(
    (acc, status) => {
      acc[status] = tasks.filter(t => t.status === status);
      return acc;
    },
    {} as Record<TaskStatus, Task[]>
  );

  return (
    <div>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <Link href={`/projects/${projectId}`}
            className='text-gray-400 hover:text-brand-700 transition-colors'>
            <ArrowLeft className='w-5 h-5' />
          </Link>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>Task Board</h2>
            <p className='text-sm text-gray-400'>{tasks.length} total tasks</p>
          </div>
        </div>
        <Button className='bg-brand-700 hover:bg-brand-800'>
          <Plus className='w-4 h-4 mr-2' /> Add Task
        </Button>
      </div>

      {/* Kanban board */}
      {isLoading
        ? <LoadingSpinner size='lg' className='py-16' />
        : (
          <div className='flex gap-4 overflow-x-auto pb-6'>
            {ALL_STATUSES.map(status => (
              <TaskColumn
                key={status}
                status={status}
                tasks={tasksByStatus[status]}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )
      }
    </div>
  );
}