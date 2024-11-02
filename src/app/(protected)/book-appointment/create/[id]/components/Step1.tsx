'use client';
import React, { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import moment from 'moment';
import Doctor from '@/types/Doctor';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import useStore from '@/store/useStore';
import { Label } from '@/components/ui/label';

const Step1: FC<{ data: Doctor }> = ({ data }) => {
  const { message, setMessage } = useStore(
    (state) => state.schedule_appointments
  );

  return (
    <Card className='rounded-[24px] border-[6px] border-primary px-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]'>
      <CardContent className='p-6'>
        <h4 className='mb-10 text-2xl font-medium'>
          Schedule an appointment with
        </h4>
        <div className='flex flex-col space-y-5 sm:flex-row sm:space-y-0'>
          <div className='sm:w-1/2'>
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
              <div className='space-y-0.5'>
                <h4 className='text-2xl font-bold'>
                  Dr. {data.first_name} {data.last_name}
                </h4>
                <p className='text-xl font-medium'>OB-Gyne</p>
              </div>
            </div>
          </div>
          <div className='sm:w-1/2'>
            <div className='text-right'>
              <div className='inline-block border-r-[9px] border-foreground pr-10'>
                <h4 className='text-[2rem] font-medium'>
                  Available Time Schedule
                </h4>
                <h5 className='text-[2.5rem] font-bold'>
                  {' '}
                  {moment(data.doctor.time_start, 'HH:mm').format('hh:mmA') +
                    ' - ' +
                    moment(data.doctor.time_end, 'HH:mm').format('hh:mmA')}
                </h5>
              </div>
              <div className='inline-block pl-10'>
                <h4 className='text-[2rem] font-medium'>Cost</h4>
                <h5 className='text-[2.5rem] font-bold'>₱700</h5>
              </div>
            </div>
          </div>
        </div>
        <div className='my-10 flex flex-col space-y-5 sm:flex-row sm:space-y-0'>
          <div className='sm:w-1/2'>
            <div className='space-y-3'>
              <Label className='text-2xl font-medium' htmlFor='inputLocation'>
                Location
              </Label>
              <RadioGroup
                defaultValue='f2f'
                id='inputLocation'
                className='text-[1.06rem] font-bold'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='f2f' id='r1' />
                  <Label htmlFor='r1'>Face to Face</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='comfortable' id='r2' disabled />
                  <Label htmlFor='r2'>Online</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className='sm:w-1/2'>
            <div className='space-y-3'>
              <Label htmlFor='inputMessage' className='text-2xl font-medium'>
                Message (optional)
              </Label>
              <Textarea
                id='inputMessage'
                placeholder='Write a message...'
                rows={10}
                onChange={(e) => setMessage(e.target.value)}
                value={message || ''}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step1;
