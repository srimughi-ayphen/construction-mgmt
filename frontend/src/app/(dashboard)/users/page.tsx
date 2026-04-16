'use client';

import { useState }    from 'react';
import { Users, Plus } from 'lucide-react';
import { PageHeader }  from '@/components/shared/PageHeader';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button }      from '@/components/ui/button';
import { Badge }       from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUsers }    from '@/lib/hooks';
import { formatDate }  from '@/lib/utils';
import { User } from '@/lib/types';

export default function UsersPage() {
  const [role, setRole] = useState<string>('all');

  const { data, isLoading } = useUsers({
    role: role === 'all' ? undefined : role,
  });

  const users = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title='Users'
        description={`${users.length} user${users.length !== 1 ? 's' : ''}`}
        icon={Users}
        action={
          <Button className='bg-brand-700 hover:bg-brand-800'>
            <Plus className='w-4 h-4 mr-2' /> Add User
          </Button>
        }
      />

      {/* Role filter */}
      <div className='mb-4'>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='All roles' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Roles</SelectItem>
            <SelectItem value='admin'>Admin</SelectItem>
            <SelectItem value='manager'>Manager</SelectItem>
            <SelectItem value='worker'>Worker</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading
        ? <LoadingSpinner size='lg' className='py-16' />
        : (
          <div className='rounded-lg border border-gray-200 overflow-hidden bg-white'>
            <Table>
              <TableHeader>
                <TableRow className='bg-gray-50'>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
               {users.map((user: User) => (
                  <TableRow key={user.id} className='hover:bg-gray-50'>
                    <TableCell className='font-medium text-gray-900'>
                      {user.name}
                    </TableCell>
                    <TableCell className='text-gray-500 text-sm'>
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.role} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.is_active ? 'default' : 'secondary'}
                        className={user.is_active
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-500'
                        }
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-sm text-gray-400'>
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button variant='ghost' size='sm'
                        className='text-gray-500 hover:text-brand-700'>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      }
    </div>
  );
}