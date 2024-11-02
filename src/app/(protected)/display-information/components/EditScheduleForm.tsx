'use client';
import AppSpinner from '@/components/AppSpinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useSaveDoctorInfo } from '@/lib/DoctorsAPI';
import Doctor from '@/types/Doctor';
import { WEEKDAYS } from '@/utils/constants';
import { strings } from '@/utils/strings';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css';
import 'react-clock/dist/Clock.css';

const inputSchema = z.object({
  days_available: z
    .array(
      z.string({
        required_error: strings.validation.required,
      })
    )
    .nonempty({
      message: strings.validation.required,
    })
    .min(1, {
      message: strings.validation.required,
    }),
  time_available: z.tuple(
    [
      z.string({
        required_error: strings.validation.required,
      }),
      z.string({
        required_error: strings.validation.required,
      }),
    ],
    {
      required_error: strings.validation.required,
      invalid_type_error: strings.validation.required,
    }
  ),
});

export type DoctorScheduleInputs = z.infer<typeof inputSchema>;

const EditScheduleForm: FC<{ data: Pick<Doctor, 'doctor'> | null }> = ({
  data,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<DoctorScheduleInputs>({
    resolver: zodResolver(inputSchema),
  });

  const { mutate, isPending } = useSaveDoctorInfo();

  const onSubmit = (inputs: DoctorScheduleInputs) => {
    mutate(
      {
        id: data ? data.doctor.id : null,
        inputs: inputs,
      },
      {
        onSuccess: (response) => {
          if (response.success) setIsOpen(false);
        },
        onSettled: () => {
          form.reset();
          router.refresh();
        },
      }
    );
  };

  useEffect(() => {
    if (data && data.doctor) {
      if (data.doctor.days_available) {
        form.setValue(
          'days_available',
          data.doctor.days_available.split(',') as [string, ...string[]]
        );
      }

      if (data.doctor.time_start && data.doctor.time_end) {
        form.setValue('time_available', [
          data.doctor.time_start,
          data.doctor.time_end,
        ]);
      }
    }
  }, [data, form]);

  return (
    <>
      <Button
        variant='outline'
        className='h-auto rounded-xl border-[5px] py-2 text-lg font-semibold'
        size='lg'
        onClick={() => setIsOpen((state) => !state)}
      >
        Edit Day and Time
      </Button>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen((state) => !state)}>
        <DialogContent
          className='sm:max-w-[800px]'
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-5'
              >
                <FormField
                  control={form.control}
                  name='days_available'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-4xl font-bold'>
                        Schedule of Availability
                      </FormLabel>
                      <FormControl>
                        <ul className='mb-4 space-x-5 font-semibold'>
                          {WEEKDAYS.map((item) => {
                            return (
                              <li key={item.value} className='inline-block'>
                                <Button
                                  type='button'
                                  className={`flex h-[3.43rem] w-[3.43rem] items-center justify-center rounded-full text-2xl ${
                                    field.value &&
                                    field.value.includes(item.value)
                                      ? 'bg-primary'
                                      : 'bg-[#D9D9D9]'
                                  }`}
                                  onClick={() => {
                                    let arr = field.value
                                      ? [...field.value]
                                      : [];
                                    if (!arr.includes(item.value)) {
                                      arr.push(item.value);
                                      form.setValue(
                                        'days_available',
                                        arr as [string, ...string[]]
                                      );
                                    } else {
                                      arr = arr.filter((v) => v != item.value);
                                      form.setValue(
                                        'days_available',
                                        arr as [string, ...string[]]
                                      );
                                    }
                                  }}
                                >
                                  <span>{item.label}</span>
                                </Button>
                              </li>
                            );
                          })}
                        </ul>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='time_available'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xl font-bold'>
                        Change Time
                      </FormLabel>
                      <FormControl>
                        <div>
                          <TimeRangePicker
                            value={field.value}
                            onChange={(v) => field.onChange(v)}
                            className='w-32 rounded-xl text-[2rem] font-medium'
                            shouldOpenClock={() => false}
                            shouldCloseClock={() => false}
                            minutePlaceholder='mm'
                            hourPlaceholder='hh'
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='text-right'>
                  <Button
                    variant='outline'
                    className='ml-auto h-auto rounded-xl border-[5px] py-2 text-lg font-semibold'
                    size='lg'
                    disabled={isPending}
                  >
                    {isPending ? (
                      <AppSpinner className='mx-auto' />
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditScheduleForm;
