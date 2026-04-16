'use client';

import Link             from 'next/link';
import { use }          from 'react';
import { ArrowLeft, ClipboardList, Users, Calendar, Edit } from 'lucide-react';
import { Button }        from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge }   from '@/components/shared/StatusBadge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { MilestoneProgress } from '@/components/projects/MilestoneProgress';
import { formatDate }    from '@/lib/utils';
import { useProject }    from '@/lib/hooks';
import { useQuery }      from '@tanstack/react-query';
import { apiClient }     from '@/lib/api';
import type { Milestone } from '@/lib/types';

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: projectRes, isLoading } = useProject(id);
  const project = projectRes?.data;

  const { data: milestones = [] } = useQuery<Milestone[]>({
    queryKey: ['milestones', id],
    queryFn:  async () => {
      const { data } = await apiClient.get(`/projects/${id}/milestones`);
      return data.data;
    },
    enabled: Boolean(id),
  });

  if (isLoading) return <LoadingSpinner size='lg' className='py-24' />;
  if (!project)  return <p className='text-red-600'>Project not found.</p>;

  return (
    <div className='max-w-4xl'>

      {/* Breadcrumb */}
      <Link href='/projects'
        className='flex items-center gap-1 text-sm text-gray-500
                   hover:text-brand-700 mb-4 w-fit'>
        <ArrowLeft className='w-4 h-4' /> Back to Projects
      </Link>

      {/* Header */}
      <div className='flex items-start justify-between mb-6'>
        <div>
          <div className='flex items-center gap-3 mb-1'>
            <h1 className='text-2xl font-bold text-gray-900'>{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          {project.description && (
            <p className='text-gray-500 text-sm max-w-xl'>{project.description}</p>
          )}
        </div>
        <Button variant='outline' size='sm'>
          <Edit className='w-4 h-4 mr-2' /> Edit
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <Card>
          <CardContent className='pt-4'>
            <p className='text-xs text-gray-400 mb-1 uppercase tracking-wide'>Timeline</p>
            <div className='flex items-center gap-1 text-sm font-medium text-gray-700'>
              <Calendar className='w-4 h-4 text-brand-600' />
              {formatDate(project.start_date)}
              {project.end_date && ` - ${formatDate(project.end_date)}`}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-4'>
            <p className='text-xs text-gray-400 mb-1 uppercase tracking-wide'>Project Manager</p>
            <div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
              <Users className='w-4 h-4 text-brand-600' />
              {project.creator?.name ?? 'Unknown'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-4'>
            <p className='text-xs text-gray-400 mb-1 uppercase tracking-wide'>Milestones</p>
            <div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
              <ClipboardList className='w-4 h-4 text-brand-600' />
              {milestones.filter(m => m.is_completed).length} / {milestones.length} complete
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestone progress */}
      {milestones.length > 0 && (
        <Card className='mb-6'>
          <CardHeader>
            <h2 className='font-semibold text-gray-800'>Milestones</h2>
          </CardHeader>
          <CardContent>
            <MilestoneProgress milestones={milestones} />
          </CardContent>
        </Card>
      )}

      {/* Task board link */}
      <Link href={`/projects/${id}/tasks`}>
        <Card className='hover:shadow-md transition-shadow cursor-pointer border-dashed
                         border-brand-300 bg-brand-50'>
          <CardContent className='flex items-center justify-center gap-3 py-8'>
            <ClipboardList className='w-6 h-6 text-brand-600' />
            <span className='font-medium text-brand-700'>Open Task Board</span>
          </CardContent>
        </Card>
      </Link>

    </div>
  );
}