'use client';
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import z from 'zod';
import { strings } from '@/utils/strings';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpdateDoctorStatus } from '@/lib/DoctorsAPI';
import { useSession } from 'next-auth/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

const inputSchema = z.object({
  status: z
    .boolean({
      required_error: strings.validation.required,
    })
    .default(false),
});

export type DoctorToggleInput = z.infer<typeof inputSchema>;

const AppDoctorToggleAccount = () => {
  const session = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
    null
  );
  const form = useForm<DoctorToggleInput>({
    resolver: zodResolver(inputSchema),
    defaultValues: async () => {
      const { data } = await api.get<{
        success: boolean;
        status: 'enabled' | 'disabled';
      }>('/api/doctors/check-status');

      return {
        status: data && data.status == 'enabled' ? true : false,
      };
    },
  });

  const { mutate } = useUpdateDoctorStatus();

  const onSubmit = (inputs: DoctorToggleInput) => {
    if (session.data) {
      mutate(
        {
          id: session.data.user.id,
          status: inputs.status ? 'enabled' : 'disabled',
        },
        {
          onSuccess: (response) => {
            if (!response.success) {
              setIsDialogOpen(true);
              setDialogContent(response.message);
              form.resetField('status');
            }
          },
        }
      );
    }
  };

  if (form.formState.isLoading) {
    return (
      <div className='mt-5 text-center'>
        <div className='justify-between-p3 flex flex-col'>
          <div className='space-y-3'>
            <Skeleton className='h-[23px] w-full' />
            <Skeleton className='h-[36px] w-full' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='mt-5 text-center'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='flex flex-col justify-between p-3'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Enable/Disable Account
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(v) => {
                        field.onChange(v);
                        form.handleSubmit(onSubmit)();
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className='max-w-4xl'>
          <AlertDialogHeader>
            <AlertDialogDescription className='p-20 text-center text-[2.5rem] font-bold'>
              {dialogContent}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href='/verification'>Go to Verification</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AppDoctorToggleAccount;
