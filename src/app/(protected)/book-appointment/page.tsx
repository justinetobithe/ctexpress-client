import React from 'react';
import DoctorsList from './components/DoctorsList';

const page = () => {
  return (
    <>
      <h1 className='text-[2rem] font-bold mb-5'>Available Doctors</h1>
      <DoctorsList />
    </>
  );
};

export default page;
