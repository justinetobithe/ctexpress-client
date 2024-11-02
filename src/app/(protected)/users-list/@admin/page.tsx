import AppUsersTable from '@/components/AppUsersTable';
import React from 'react';

const page = () => {
  return (
    <>
      <h1 className='text-[2rem] font-bold'>User List</h1>
      <AppUsersTable />
    </>
  );
};

export default page;
