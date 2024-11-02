import React from 'react';
import { api } from '@/lib/api';
import { getServerSession } from 'next-auth';
import AuthOptions from '@/lib/AuthOptions';
import Doctor from '@/types/Doctor';
import AppDoctorDisplayInfo from '@/components/doctors/AppDoctorDisplayInfo';
import EditScheduleForm from './components/EditScheduleForm';
import EditInfoForm from './components/EditInfoForm';

const page = async () => {
  const session = await getServerSession(AuthOptions);
  const { data } = await api.get<Doctor>(`/api/doctors/${session?.user.id}`);

  return (
    <div className='py-10'>
      <AppDoctorDisplayInfo data={data} displayPayment>
        <EditScheduleForm data={data.doctor ? { doctor: data.doctor } : null} />
        <EditInfoForm
          data={
            data.doctor
              ? { doctor: data.doctor, contact_number: data.contact_number }
              : null
          }
        />
      </AppDoctorDisplayInfo>
    </div>
  );
};

export default page;
