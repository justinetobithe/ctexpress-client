import Doctor from '@/types/Doctor';
import React, { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import moment from 'moment';
import useStore from '@/store/useStore';

const Step3: FC<{ data: Doctor }> = ({ data }) => {
  const { date, time } = useStore((state) => state.schedule_appointments);
  return (
    <div className='mx-auto max-w-lg'>
      <div className='flex items-center space-x-5'>
        <div>
          <Avatar className='h-[138px] w-[138px]'>
            <AvatarImage
              src={data.image || ''}
              alt='AVATAR'
              className='object-cover'
            />
            <AvatarFallback className='text-4xl font-medium'>
              {data.first_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className='flex-1'>
          <div className='max-h-[194px] space-y-0.5 overflow-y-auto'>
            <h4 className='text-2xl font-bold'>
              Dr. {data.first_name} {data.last_name}
            </h4>
            <p>Clinic Address: {data.doctor.address || 'N/A'}</p>
            <p>Contact Number: {data.contact_number || 'N/A'}</p>
            <p>Email: {data.email || 'N/A'}</p>
          </div>
        </div>
      </div>
      <div className='mt-10 px-10'>
        <div className='flex items-center space-x-5'>
          <div className='h-[4rem] w-[4rem] rounded-full border-[4px] border-primary bg-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]'></div>
          <div className='flex-1'>
            <p className='text-xl font-medium'>
              {date ? moment(date).format('dddd, MMMM DD') : null}
            </p>
            <p className='text-lg font-bold'>
              {time
                ? time
                    .map((item) => moment(item, 'HH:mm').format('hh:mmA'))
                    .join(' - ')
                : null}
            </p>
          </div>
        </div>
      </div>
      <div className='mt-10 px-10'>
        <div className='flex items-center space-x-5'>
          <div className='h-[4rem] w-[4rem] rounded-full border-[4px] border-primary bg-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]'></div>
          <div className='flex-1'>
            <p className='text-xl font-medium'>Location</p>
            <p className='text-xl font-medium'>Face to Face</p>
            <p className='text-lg font-bold'>
              {time
                ? time
                    .map((item) => moment(item, 'HH:mm').format('hh:mmA'))
                    .join(' - ')
                : null}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;
