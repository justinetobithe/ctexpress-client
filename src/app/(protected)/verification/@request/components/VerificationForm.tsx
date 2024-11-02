'use client';
import AppSpinner from '@/components/AppSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRequestVerification } from '@/lib/DoctorsAPI';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/utils/constants';
import { convertBtoMb } from '@/utils/convertBtoMb';
import { strings } from '@/utils/strings';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const inputSchema = z.object({
  doctor_id_img: z
    .any()
    .refine((v) => v, strings.validation.required)
    .refine((file: File | string) => {
      if (typeof file === 'string') return true;
      return file instanceof File && convertBtoMb(file.size) <= MAX_FILE_SIZE;
    }, strings.validation.max_image_size)
    .refine((file: File | string) => {
      if (typeof file === 'string') return true;
      return file && ACCEPTED_IMAGE_TYPES.includes(file?.type);
    }, strings.validation.allowed_image_formats)
    .transform((v) => (typeof v === 'string' ? '' : v)),
  valid_id_img: z
    .any()
    .refine((v) => v, strings.validation.required)
    .refine((file: File | string) => {
      if (typeof file === 'string') return true;
      return file instanceof File && convertBtoMb(file.size) <= MAX_FILE_SIZE;
    }, strings.validation.max_image_size)
    .refine((file: File | string) => {
      if (typeof file === 'string') return true;
      return file && ACCEPTED_IMAGE_TYPES.includes(file?.type);
    }, strings.validation.allowed_image_formats)
    .transform((v) => (typeof v === 'string' ? '' : v)),
});

export type VerificationFormInputs = z.infer<typeof inputSchema>;

const VerificationForm = () => {
  const session = useSession();
  const router = useRouter();
  const form = useForm<VerificationFormInputs>({
    resolver: zodResolver(inputSchema),
  });

  const { mutate, isPending } = useRequestVerification();

  const onSubmit = (inputs: VerificationFormInputs) => {
    if (session.data) {
      mutate(
        {
          id: session.data.user.id,
          params: inputs,
        },
        {
          onSettled: () => {
            router.refresh();
          },
        }
      );
    }
  };

  return (
    <Card className='rounded-2xl'>
      <CardContent className='px-20 py-16'>
        <>
          <h3 className='mb-16 text-center text-4xl font-semibold'>
            To validate your account. please submit
            <br />
            the following:
          </h3>

          <div className='grid grid-cols-2 items-center px-20'>
            <ul className='list-disc text-4xl font-semibold'>
              <li>1 OB-Gyne ID</li>
              <li>1 Valid ID</li>
            </ul>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name='doctor_id_img'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel />
                      <FormControl>
                        <Input
                          type='file'
                          placeholder='Please attach OB-Gyne ID'
                          accept='image/*'
                          {...field}
                          className='border-primary focus-visible:ring-offset-0'
                          onChange={(e) => {
                            if (e.target.files)
                              field.onChange(e.target.files[0]);
                          }}
                          value={field.value ? field.value.fileName : ''}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='valid_id_img'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel />
                      <FormControl>
                        <Input
                          type='file'
                          placeholder='Please attach Valid ID'
                          accept='image/*'
                          {...field}
                          className='border-primary focus-visible:ring-offset-0'
                          onChange={(e) => {
                            if (e.target.files)
                              field.onChange(e.target.files[0]);
                          }}
                          value={field.value ? field.value.fileName : ''}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <div className='mt-10 px-20 text-right'>
            <Button
              variant='outline'
              onClick={() => form.handleSubmit(onSubmit)()}
              className='rounded-xl px-20'
              disabled={isPending}
            >
              {isPending ? <AppSpinner /> : 'Submit'}
            </Button>
          </div>
        </>
      </CardContent>
    </Card>
  );
};

export default VerificationForm;
