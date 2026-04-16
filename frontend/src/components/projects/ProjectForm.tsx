'use client';

import { useForm }     from 'react-hook-form';
import { zodResolver }  from '@hookform/resolvers/zod';
import { z }            from 'zod';
import { toast }        from 'sonner';
import { Button }       from '@/components/ui/button';
import { Input }        from '@/components/ui/input';
import { Label }        from '@/components/ui/label';
import { Textarea }     from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { useCreateProject } from '@/lib/hooks';
import { useUsers }         from '@/lib/hooks';

// ── Schema ────────────────────────────────────────────────────────────────────
// status uses .default() only at runtime (not in the type) by keeping it
// as a required enum with a defaultValues fallback on the form instead.
const schema = z.object({
  name:        z.string().min(3, 'Name must be at least 3 characters').max(200),
  description: z.string().max(2000).optional(),
  status:      z.enum(['planning', 'active', 'on_hold', 'completed']),
  start_date:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format'),
  end_date:    z.union([
                 z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
                 z.literal(''),
               ]).optional(),
  created_by:  z.string().uuid('Please select a project manager'),
});

type FormValues = z.infer<typeof schema>;

// ── Types ─────────────────────────────────────────────────────────────────────
interface Manager {
  id:   string;
  name: string;
}

interface ProjectFormProps {
  open:    boolean;
  onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function ProjectForm({ open, onClose }: ProjectFormProps) {
  const createProject      = useCreateProject();
  const { data: usersRes } = useUsers({ role: 'manager' });
  const managers: Manager[] = (usersRes?.data ?? []) as Manager[];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'planning',   // ← replaces z.default() — no type mismatch
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createProject.mutateAsync({
        ...values,
        end_date: values.end_date || undefined,
      });
      toast.success('Project created', { description: values.name });
      reset();
      onClose();
    } catch (err: unknown) {
      toast.error('Failed to create project', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>

          {/* Name */}
          <div>
            <Label htmlFor='name'>Project Name *</Label>
            <Input
              id='name'
              {...register('name')}
              placeholder='e.g. City Hall Renovation'
            />
            {errors.name && (
              <p className='text-xs text-red-500 mt-1'>{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              {...register('description')}
              rows={3}
              placeholder='Project scope and objectives...'
            />
          </div>

          {/* Dates */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <Label htmlFor='start_date'>Start Date *</Label>
              <Input id='start_date' type='date' {...register('start_date')} />
              {errors.start_date && (
                <p className='text-xs text-red-500 mt-1'>{errors.start_date.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor='end_date'>End Date</Label>
              <Input id='end_date' type='date' {...register('end_date')} />
            </div>
          </div>

          {/* Project Manager */}
          <div>
            <Label>Project Manager *</Label>
            <Select onValueChange={(v) => setValue('created_by', v, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder='Select a manager' />
              </SelectTrigger>
              <SelectContent>
                {managers.map((m: Manager) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.created_by && (
              <p className='text-xs text-red-500 mt-1'>{errors.created_by.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting || createProject.isPending}
              className='bg-brand-700 hover:bg-brand-800'
            >
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}