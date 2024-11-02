'use client';
import React, { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { strings } from '@/utils/strings';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import log from '@/utils/logger';
import { useSaveInformativeVideo } from '@/lib/InformativeVideosAPI';
import { InformativeVideo } from '@/types/InformativeVideo';

const inputSchema = z.object({
  title: z
    .string({
      required_error: strings.validation.required,
    })
    .min(3, {
      message: strings.validation.required,
    }),
  link: z
    .string({
      required_error: strings.validation.required,
    })
    .min(3, {
      message: strings.validation.required,
    })
    .url(),
});

export type InformativeVideoInputs = z.infer<typeof inputSchema>;

const InformativeVideoForm: FC<{
  isEdit?: boolean;
  buttonTrigger: React.ReactNode;
  data?: InformativeVideo | null;
}> = ({ isEdit = false, buttonTrigger, data = null }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<InformativeVideoInputs>({
    resolver: zodResolver(inputSchema),
    defaultValues: data ?? undefined,
  });

  const { mutate: saveInformativeVideo } = useSaveInformativeVideo();

  const onSubmit = (inputs: InformativeVideoInputs) => {
    saveInformativeVideo(
      {
        id: data ? data.id : null,
        inputs: inputs,
      },
      {
        onSettled: () => {
          setIsOpen(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{buttonTrigger}</DialogTrigger>
      <DialogContent className='max-w-2xl p-10'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit' : 'Add New'} Informative Video
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FormField
              control={form.control}
              name='title'
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium'>Title</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      {...field}
                      className='border-border focus-visible:ring-offset-0'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='link'
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium'>Link</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      {...field}
                      className='border-border focus-visible:ring-offset-0'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full'>SUBMIT</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InformativeVideoForm;
