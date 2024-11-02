import Doctor from '@/types/Doctor';
import React, { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import useStore from '@/store/useStore';

const Step4: FC<{ data: Doctor }> = ({ data }) => {
  const { reference_no, setReferenceNo } = useStore(
    (state) => state.schedule_appointments
  );

  return (
    <>
      <h1 className='mb-3 text-4xl font-semibold'>Payment Details</h1>
      <p className='mb-10 font-normal'>
        complete your appointment by providing your details
      </p>
      <div className='flex space-y-5 sm:space-y-0 flex-col sm:flex-row sm:space-x-10'>
        <div className='sm:w-1/2'>
          <Card className='rounded-[43px] border border-[#D4D4D4] px-2'>
            <CardContent className='px-6 py-10'>
              <h4 className='mb-5 text-2xl font-bold'>Payment Method</h4>
              <div className='ml-8 flex items-start space-x-5'>
                <div className='mt-3 h-[1.5rem] w-[1.5rem] rounded-full border-[4px] border-[#000000] bg-white'></div>
                <div className='flex-1'>
                  <p className='text-2xl font-bold'>Gcash</p>
                  <p className='font-medium'>{data.doctor.gcash_number}</p>
                  <p className='mt-5 text-xl font-bold'>Scan QR Code to pay</p>
                  <div className='relative h-[15rem] max-w-[15rem] border border-border'>
                    <Image
                      alt='GCASH QR CODE'
                      src={data.doctor.gcash_qr_code.url}
                      fill={true}
                      className='object-contain'
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='sm:w-1/2'>
          <Card className='rounded-[43px] border border-[#D4D4D4] px-2'>
            <CardContent className='relative px-6 py-10'>
              <div className='mt-10 min-h-[400px] px-10'>
                <div className='px-10'>
                  <p className='text-2xl font-bold'>Doctor's Fee: ₱{data.doctor.doctor_fee}</p>
                </div>
                <div className='my-10 h-px border-b-2 border-[#000000]'></div>
                <p className='text-right text-5xl font-bold'>Total: ₱{data.doctor.doctor_fee}</p>
              </div>
              <div className='px-10'>
                <p className='mb-5 text-center text-4xl font-bold'>
                  Enter Reference #:
                </p>
                <Input
                  type='text'
                  className='h-12 rounded-xl border-primary text-3xl font-medium'
                  size={10}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  value={reference_no || ''}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Step4;
