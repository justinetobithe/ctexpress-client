import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import React, { FC } from 'react';
import Doctor from '@/types/Doctor';
import CreateAppointmentSteps from './components/CreateAppointmentSteps';

const page: FC<{ params: { id: string } }> = async ({ params }) => {
  const { data } = await api.get<Doctor>(`/api/doctors/${params.id}`);

  if (isNaN(parseInt(params.id)) || !data) return notFound();

  return (
    <>
      <h1 className='mb-5 text-[2rem] font-bold'>Schedule Appointment</h1>
      <CreateAppointmentSteps data={data} />
    </>
  );
};

export default page;
