import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <div className='flex space-x-10'>
      <div className='w-1/2 flex-1'>
        <div className='mb-10 flex space-x-10'>
          <div>
            <Skeleton className='h-[256px] w-[256px] rounded-full' />
          </div>
          <div className='flex-1'>
            <Skeleton className='mb-3 h-[48px] w-full' />
            <Skeleton className='mb-3 h-[48px] w-full' />
            <div className='space-y-3'>
              <Skeleton className='h-[28px] w-full' />
              <Skeleton className='h-[28px] w-full' />
              <Skeleton className='h-[28px] w-full' />
            </div>
          </div>
        </div>
        <div className='space-y-5'>
          <div>
            <Skeleton className='mb-3 h-[28px] w-full' />
            <Skeleton className='h-[140px] w-full' />
          </div>
          <div>
            <Skeleton className='mb-3 h-[28px] w-full' />
            <Skeleton className='h-[140px] w-full' />
          </div>
          <div>
            <Skeleton className='mb-3 h-[28px] w-full' />
            <Skeleton className='h-[140px] w-full' />
          </div>
        </div>
      </div>
      <div className='relative w-1/2 flex-1'>
        <Card className='rounded-2xl p-5'>
          <CardHeader>
            <CardTitle className='text-4xl font-bold'>
              <Skeleton className='h-[40px] w-full' />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className='mb-3 h-[54px] w-full' />
            <Skeleton className='h-[48px] w-full' />
          </CardContent>
          <CardFooter>
            <Skeleton className='h-[54px] w-[220px]' />
          </CardFooter>
        </Card>
        <Skeleton className='absolute bottom-16 right-0 h-[54px] w-[220px]' />
      </div>
    </div>
  );
};

export default Loading;
