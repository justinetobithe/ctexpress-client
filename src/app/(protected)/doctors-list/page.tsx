import React from 'react';
import DoctorsListTable from './components/DoctorsListTable';

const page = () => {
  return (
    <>
      <h1 className='text-[2rem] font-bold'>Doctors List</h1>
      <DoctorsListTable />
    </>
  );
};

export default page;
