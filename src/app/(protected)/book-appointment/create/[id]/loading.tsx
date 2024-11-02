import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const loading = () => {
  return (
    <>
      <Skeleton className='mb-5 h-[48px] w-[260px]' />
      <Skeleton className='mb-5 h-[40px] w-full' />
      <Skeleton className='mb-5 h-[692px] w-full rounded-[24px]' />
      <div className='after:clear-both'>
        <div className='float-left'>
          <Skeleton className='h-[40px] w-[77px]' />
        </div>
        <div className='float-right'>
          <Skeleton className='h-[40px] w-[77px]' />
        </div>
      </div>
    </>
  );
};

export default loading;
