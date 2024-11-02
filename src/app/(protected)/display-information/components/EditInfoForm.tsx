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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSaveDoctorInfo } from '@/lib/DoctorsAPI';
import Doctor from '@/types/Doctor';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/utils/constants';
import { convertBtoMb } from '@/utils/convertBtoMb';
import { strings } from '@/utils/strings';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import Image from 'next/image';

const inputSchema = z.object({
  demographic_info: z
    .string({
      required_error: strings.validation.required,
    })
    .min(1, {
      message: strings.validation.required,
    }),
  medical_school: z
    .string({
      required_error: strings.validation.required,
    })
    .min(1, {
      message: strings.validation.required,
    }),
  residency_training: z
    .string({
      required_error: strings.validation.required,
    })
    .min(1, {
      message: strings.validation.required,
    }),
  address: z
    .string({
      required_error: strings.validation.required,
    })
    .min(1, {
      message: strings.validation.required,
    }),
  contact_number: z
    .string({
      required_error: strings.validation.required,
    })
    .min(1, {
      message: strings.validation.required,
    }),
  doctor_fee: z
    .string({
      required_error: strings.validation.required,
    })
    .min(1, {
      message: strings.validation.required,
    }),
  gcash_number: z
    .string({
      required_error: strings.validation.required,
    })
    .min(1, {
      message: strings.validation.required,
    }),
  gcash_qr_code: z
    .any()
    .refine((file: File | string) => {
      if (typeof file === 'string') return true;
      return file instanceof File && convertBtoMb(file.size) <= MAX_FILE_SIZE;
    }, strings.validation.max_image_size)
    .refine((file: File | string) => {
      console.log('typeof:', file);
      if (typeof file === 'string') return true;
      return file && ACCEPTED_IMAGE_TYPES.includes(file?.type);
    }, strings.validation.allowed_image_formats)
    .transform((v) => (typeof v === 'string' ? '' : v)),
});

export type DisplayInformationInputs = z.infer<typeof inputSchema>;

const EditInfoForm: FC<{
  data: Pick<Doctor, 'doctor' | 'contact_number'> | null;
}> = ({ data }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<DisplayInformationInputs>({
    resolver: zodResolver(inputSchema),
  });
  const [image, setImage] = useState('');

  const { mutate, isPending } = useSaveDoctorInfo();

  const onSubmit = (inputs: DisplayInformationInputs) => {
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
      if (data.doctor.demographic_info) {
        form.setValue('demographic_info', data.doctor.demographic_info);
      }

      if (data.doctor.medical_school) {
        form.setValue('medical_school', data.doctor.medical_school);
      }

      if (data.doctor.residency_training) {
        form.setValue('residency_training', data.doctor.residency_training);
      }

      if (data.doctor.address) {
        form.setValue('address', data.doctor.address);
      }

      if (data.contact_number) {
        form.setValue('contact_number', data.contact_number);
      }

      if (data.doctor.doctor_fee) {
        form.setValue('doctor_fee', data.doctor.doctor_fee.toString());
      }

      if (data.doctor.gcash_number) {
        form.setValue('gcash_number', data.doctor.gcash_number);
      }

      if (data.doctor.gcash_qr_code) {
        setImage(data.doctor.gcash_qr_code.url);
        form.setValue('gcash_qr_code', data.doctor.gcash_qr_code.url);
      }
    }
  }, [data, form]);

  return (
    <>
      <Button
        variant='outline'
        className='absolute bottom-16 right-0 h-auto rounded-xl border-[5px] py-2 text-lg font-semibold'
        size='lg'
        onClick={() => setIsOpen((state) => !state)}
      >
        Edit Information
      </Button>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen((state) => !state)}>
        <DialogContent
          className='max-h-[calc(100vh-5rem)] overflow-y-auto sm:max-w-[1200px]'
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
                  name='demographic_info'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xl font-bold'>
                        DEMOGRAPHIC INFORMATION
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Write something...'
                          {...field}
                          rows={5}
                          className='bg-[#F9F9F9]'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='medical_school'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xl font-bold'>
                        MEDICAL SCHOOL
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Write something...'
                          {...field}
                          rows={5}
                          className='bg-[#F9F9F9]'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='residency_training'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xl font-bold'>
                        RESIDENCY TRAINING
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Write something...'
                          {...field}
                          rows={5}
                          className='bg-[#F9F9F9]'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xl font-bold'>
                        CLINIC ADDRESS
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Write something...'
                          {...field}
                          rows={5}
                          className='bg-[#F9F9F9]'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='contact_number'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xl font-bold'>
                        CONTACT NUMBER
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className='bg-[#F9F9F9]' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='doctor_fee'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xl font-bold'>
                        DOCTOR'S FEE
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className='bg-[#F9F9F9]' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='gcash_number'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xl font-bold'>
                        GCASH NUMBER
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className='bg-[#F9F9F9]' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='gcash_qr_code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-medium'>
                        Gcash QR Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='file'
                          {...field}
                          className='border-border focus-visible:ring-offset-0'
                          accept='image/*'
                          onChange={(e) => {
                            if (e.target.files) {
                              field.onChange(e.target.files[0]);
                              setImage(URL.createObjectURL(e.target.files[0]));
                            }
                          }}
                          value={field.value ? field.value.fileName : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {image ? (
                  <div className='relative h-[15rem] w-[15rem]'>
                    <Image
                      alt='GCASH QR CODE'
                      src={image}
                      fill={true}
                      className='object-contain'
                    />
                  </div>
                ) : null}
                <div className='text-right'>
                  <Button
                    variant='outline'
                    className='ml-auto h-auto rounded-xl border-[5px] py-2 text-center text-lg font-semibold'
                    size='lg'
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span>Saving...</span>
                        <AppSpinner />
                      </>
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

export default EditInfoForm;
