import React, { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import moment from 'moment';
import { Patient } from '@/types/Patient';
import { convertBtoMb } from '@/utils/convertBtoMb';
import { useRouter } from 'next/navigation';

const AppMotherInfo: FC<{ data: Patient }> = ({ data }) => {
  const router = useRouter();
  return (
    <div className='flex space-x-10'>
      <div className='w-1/2 flex-1'>
        <div className='mb-10 flex space-x-10'>
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
            </div>
          </div>
        </div>
        <div>
          <h4 className='mb-3 text-5xl'>Media Files:</h4>
          <table className='w-full text-left'>
            <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
              <tr className='flex w-full'>
                <th className='w-1/3 p-4'>File Name</th>
                <th className='w-1/3 p-4'>Size</th>
                <th className='w-1/3 p-4'>Date Uploaded</th>
              </tr>
            </thead>
            <tbody
              className='bg-grey-light flex w-full flex-col items-center justify-between overflow-y-auto'
              style={{
                maxHeight: '50vh',
              }}
            >
              {data.mother.media_files.map((item) => (
                <tr
                  className='mb-4 flex w-full border-b bg-white hover:cursor-pointer'
                  key={item.id}
                  onClick={() => router.push(item.url)}
                >
                  <th scope='row' className='w-1/3 p-4'>
                    {item.name}
                  </th>
                  <td className='w-1/3 p-4'>
                    {convertBtoMb(item.size).toFixed(2)}MB
                  </td>
                  <td className='w-1/3 p-4'>
                    {moment(item.created_at).format('LLL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppMotherInfo;
