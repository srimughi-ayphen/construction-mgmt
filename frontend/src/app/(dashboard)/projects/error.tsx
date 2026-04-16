'use client';
import { useEffect } from 'react';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className='rounded-lg bg-red-50 border border-red-200 p-6 text-center'>
      <p className='text-red-700 font-medium'>Something went wrong</p>
      <p className='text-red-600 text-sm mt-1'>{error.message}</p>
      <button onClick={reset} className='mt-4 text-sm text-brand-700 underline'>Try again</button>
    </div>
  );
}