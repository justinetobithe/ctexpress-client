import React from 'react';
import AppointmentsTable from './components/AppointmentsTable';

const page = async () => {
  return (
    <>
      <h1 className='text-[2rem] font-bold'>Pending Appointments</h1>
      <AppointmentsTable />
    </>
  );
};

export default page;
