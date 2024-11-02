import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Doctor from '@/types/Doctor';
import React, { FC } from 'react';
import moment from 'moment';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WEEKDAYS } from '@/utils/constants';
import Image from 'next/image';

const AppDoctorDisplayInfo: FC<{
  data: Doctor;
  displayPayment?: boolean | false;
  children?: React.ReactNode;
}> = ({ data, displayPayment, children }) => {
  return (
    <div className='flex flex-col sm:flex-row sm:space-x-10'>
      <div className='flex-1 sm:w-1/2'>
        <div className='mb-10 flex flex-col sm:flex-row sm:space-x-10'>
          <div>
            <Avatar className='h-[256px] w-[256px]'>
              <AvatarImage
                src={data.image || ''}
                alt='AVATAR'
                className='object-cover'
              />
              <AvatarFallback className='text-5xl font-medium'>
                {data?.first_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className='flex-1'>
            <h4 className='text-[2rem] font-extrabold'>
              {data.first_name + ' ' + data.last_name}
            </h4>
            <h5 className='mb-7 text-[2rem] font-medium'>{data.email}</h5>
            <div className='space-y-3'>
              <p className='text-xl font-medium'>
                Age: {data.dob ? moment().diff(data.dob, 'years') : 'N/A'}
              </p>
              <p className='text-xl font-medium'>
                Date of Birth:{' '}
                {data.dob ? moment(data.dob).format('MMMM DD, YYYY') : 'N/A'}
              </p>
              <p className='text-xl font-medium'>
                Specialty: Obstetrics and Gynecology
              </p>
            </div>
          </div>
        </div>
        <div className='space-y-5'>
          <div>
            <h4 className='mb-3 text-xl font-bold'>DEMOGRAPHIC INFORMATION</h4>
            <p className='whitespace-pre-line text-xl'>
              {data.doctor && data.doctor.demographic_info.length
                ? data.doctor.demographic_info
                : 'N/A'}
            </p>
          </div>
          <div>
            <h4 className='mb-3 text-xl font-bold'>MEDICAL SCHOOL</h4>
            <p className='whitespace-pre-line text-xl'>
              {data.doctor && data.doctor.medical_school.length
                ? data.doctor.medical_school
                : 'N/A'}
            </p>
          </div>
          <div>
            <h4 className='mb-3 text-xl font-bold'>RESIDENCY TRAINING</h4>
            <p className='whitespace-pre-line text-xl'>
              {data.doctor && data.doctor.residency_training.length
                ? data.doctor.residency_training
                : 'N/A'}
            </p>
          </div>
          <div>
            <h4 className='mb-3 text-xl font-bold'>CLINIC ADDRESS</h4>
            <p className='whitespace-pre-line text-xl'>
              {data.doctor && data.doctor.address.length
                ? data.doctor.address
                : 'N/A'}
            </p>
          </div>
          <div>
            <h4 className='mb-3 text-xl font-bold'>DOCTOR'S FEE</h4>
            <p className='whitespace-pre-line text-xl'>
              {data.doctor && data.doctor.doctor_fee
                ? `₱${data.doctor.doctor_fee}`
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
      <div className='relative flex-1 sm:w-1/2'>
        <Card className='rounded-2xl p-5'>
          <CardHeader>
            <CardTitle className='text-4xl font-bold'>
              Schedule of Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='mb-4 space-x-5 text-2xl font-semibold'>
              {WEEKDAYS.map((item) => (
                <li key={item.value} className='inline-block'>
                  <span
                    className={`flex h-[3.43rem] w-[3.43rem] items-center justify-center rounded-full ${
                      data.doctor &&
                      data.doctor.days_available &&
                      data.doctor.days_available.includes(item.value)
                        ? 'bg-primary'
                        : 'bg-[#D9D9D9]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className='text-[2rem] font-medium'>
              {data.doctor && data.doctor.time_start && data.doctor.time_end
                ? moment(data.doctor.time_start, ['h:m a', 'H:m']).format(
                    'hh:mmA'
                  ) +
                  ' -  ' +
                  moment(data.doctor.time_end, ['h:m a', 'H:m']).format(
                    'hh:mmA'
                  )
                : 'N/A'}
            </p>
          </CardContent>
          <CardFooter>{children}</CardFooter>
        </Card>
        {displayPayment ? (
          <>
            <h4 className='mt-10 text-2xl font-bold'>Gcash Number:</h4>
            <p className='text-lg font-semibold'>{data.doctor.gcash_number}</p>
            {data.doctor.gcash_qr_code ? (
              <div className='relative mt-5 h-[15rem] max-w-[15rem]'>
                <Image
                  alt='GCASH QR CODE'
                  src={data.doctor.gcash_qr_code.url}
                  fill={true}
                  className='object-contain'
                />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AppDoctorDisplayInfo;
