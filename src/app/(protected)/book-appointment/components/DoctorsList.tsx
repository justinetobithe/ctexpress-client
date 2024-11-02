'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDoctors } from '@/lib/DoctorsAPI';
import { WEEKDAYS } from '@/utils/constants';
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import moment from 'moment';

const DoctorsList = () => {
  const { data: doctors, isLoading } = useGetDoctors();

  if (isLoading) {
    return (
      <div className='-mx-2 flex flex-wrap'>
        {Array(9)
          .fill({})
          .map((_, index) => (
            <div key={index} className='mb-3 w-1/3 px-2'>
              <Skeleton className='h-[254px] rounded-[24px]' />
            </div>
          ))}
      </div>
    );
  }

  return (
    <>
      {doctors?.data.length ? (
        <div className='-mx-2 flex flex-wrap'>
          {doctors?.data.map((item) => (
            <div key={item.id} className='mb-3 w-full lg:w-1/3 px-2'>
              <Link href={`/book-appointment/create/${item.id}`}>
                <Card className='min-h-[15.8rem] rounded-[24px] border-[6px] border-primary shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]'>
                  <CardContent className='p-6'>
                    <div className='flex space-x-5 flex-col lg:flex-row'>
                      <div>
                        <Avatar className='h-[150px] w-[150px] mx-auto'>
                          <AvatarImage src={item.image || ''} alt='AVATAR' className='object-cover' />
                          <AvatarFallback className='text-4xl font-medium'>
                            {item.first_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className='max-h-[194px] space-y-0.5 overflow-y-auto'>
                        <h4 className='text-2xl font-bold'>
                          Dr. {item.first_name} {item.last_name}
                        </h4>
                        <p>Clinic Address: {item.doctor.address || 'N/A'}</p>
                        <p>Contact Number: {item.contact_number || 'N/A'}</p>
                        <p>Email: {item.email || 'N/A'}</p>
                        <div>
                          Days Available:{' '}
                          {item.doctor.days_available ? (
                            <ul className='space-x-1 font-semibold'>
                              {WEEKDAYS.map((v) => {
                                return (
                                  <li key={v.value} className='inline-block'>
                                    <Button
                                      type='button'
                                      className={`flex h-[2rem] w-[2rem] items-center justify-center rounded-full text-lg disabled:opacity-100 ${
                                        item.doctor.days_available.includes(
                                          v.value
                                        )
                                          ? 'bg-primary'
                                          : 'bg-[#D9D9D9]'
                                      }`}
                                      disabled
                                    >
                                      <span>{v.label}</span>
                                    </Button>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            'N/A'
                          )}
                        </div>
                        {item.doctor.time_start && item.doctor.time_end ? (
                          <p className='font-bold'>
                            {moment(item.doctor.time_start, 'HH:mm').format(
                              'hh:mmA'
                            ) +
                              ' - ' +
                              moment(item.doctor.time_end, 'HH:mm').format(
                                'hh:mmA'
                              )}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div>No Doctors Available</div>
      )}
      <AlertDialog defaultOpen>
        <AlertDialogContent className='max-w-[912px] !rounded-[34px] sm:p-20'>
          <AlertDialogHeader className='mb-5'>
            <AlertDialogDescription className='text-center text-[2rem] font-medium text-foreground'>
              The initial appointment will take place in a face-to-face setting,
              while the subsequent appointments will be conducted online.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='text-center'>
            <AlertDialogAction className='mx-auto rounded-[15px] border border-primary bg-background px-10 py-5 text-foreground hover:bg-accent hover:text-accent-foreground'>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DoctorsList;
