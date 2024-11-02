import React from 'react';
import DoctorAppointmentApprovalsTable from './components/DoctorAppointmentApprovalsTable';

const page = () => {
  return (
    <>
      <h1 className='text-[2rem] font-bold'>Doctor Appointment Approvals</h1>
      <DoctorAppointmentApprovalsTable />
    </>
  );
};

export default page;
