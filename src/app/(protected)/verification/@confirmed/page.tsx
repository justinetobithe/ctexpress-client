import React from 'react';
import { UserCheck } from 'lucide-react';

const page = () => {
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='text-center'>
        <UserCheck size='5rem' className='mx-auto text-success mb-5' />
        <h3 className='text-4xl font-semibold'>Account Verified</h3>
      </div>
    </div>
  );
};

export default page;
