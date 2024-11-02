import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <div className='flex h-full items-center justify-center'>
      <Card className='rounded-2xl'>
        <CardContent className='px-20 py-16'>
          <>
            <Skeleton className='mb-16 h-[80px] w-[810px]' />
            <div className='grid grid-cols-2 items-center gap-2 px-20'>
              <ul className='list-disc space-y-2 text-4xl font-semibold'>
                <Skeleton className='h-[40px] w-full' />
                <Skeleton className='h-[40px] w-full' />
              </ul>
              <div className='space-y-2'>
                <Skeleton className='h-[40px] w-full' />
                <Skeleton className='h-[40px] w-full' />
              </div>
            </div>
            <div className='mt-10 px-20 text-right'>
              <Skeleton className='h-[40px] w-[212px] ml-auto' />
            </div>
          </>
        </CardContent>
      </Card>
    </div>
  );
};

export default Loading;
