import AppPaymentsTable from '@/components/AppPaymentsTable';
import React from 'react';

const page = () => {
  return (
    <>
      <h1 className='text-[2rem] font-bold'>Payments</h1>
      <AppPaymentsTable />
    </>
  );
};

export default page;
