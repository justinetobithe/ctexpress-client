import { api } from '@/lib/api';
import { MotherAppointment } from '@/types/Appointment';
import React from 'react';
// import AppointmentList from './components/AppointmentList';

const page = async () => {
  // const { data } = await api.get<MotherAppointment[]>(
  //   '/api/mothers/appointments'
  // );
  return (
    <>
      {/* {data.length ? (
        <AppointmentList data={data} />
      ) : ( */}
      <div className='flex h-full items-center justify-center'>
        <h3 className='text-3xl'>No Appointments Available</h3>
      </div>
      {/* )} */}
    </>
  );
};

export default page;
