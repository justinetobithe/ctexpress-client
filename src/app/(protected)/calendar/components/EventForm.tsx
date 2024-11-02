import { Event } from '@/types/Event';
import { strings } from '@/utils/strings';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/ui/button';
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
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';
import { useSaveEvent } from '@/lib/EventsAPI';
import log from '@/utils/logger';
import { GradientPicker } from '@/components/ui/GradientPicker';
import moment from 'moment';

const inputSchema = z.object({
  title: z
    .string({
      required_error: strings.validation.required,
    })
    .min(3, {
      message: strings.validation.required,
    }),
  description: z
    .string({
      required_error: strings.validation.required,
    })
    .min(3, {
      message: strings.validation.required,
    }),
  background_color: z
    .string({
      required_error: strings.validation.required,
    })
    .min(3, {
      message: strings.validation.required,
    }),
  event_date: z.tuple(
    [
      z.date({
        required_error: strings.validation.required,
        invalid_type_error: strings.validation.invalid_type,
      }),
      z.date({
        required_error: strings.validation.required,
        invalid_type_error: strings.validation.invalid_type,
      }),
    ],
    {
      required_error: strings.validation.required,
      invalid_type_error: strings.validation.invalid_type,
    }
  ),
});

export type EventFormInputs = z.infer<typeof inputSchema>;

const EventForm: FC<{ data?: Event | null; handleModalClose: () => void }> = ({
  data = null,
  handleModalClose,
}) => {
  const form = useForm<EventFormInputs>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      ...data,
      background_color: data ? data.background_color : '#F6CE47',
      event_date: data
        ? [moment(data.starts_at).toDate(), moment(data.ends_at).toDate()]
        : [new Date(), new Date()],
    },
  });

  const { mutate: saveEvent } = useSaveEvent();

  // log('[DATA]', data);

  /* HANDLERS */
  const onSubmit = (inputs: EventFormInputs) => {
    log('[INPUTS]', inputs);
    log('[EVENT DATE]', {
      starts_at: moment(inputs.event_date[0]).format('YYYY-MM-DD HH:mm'),
      ends_at: moment(inputs.event_date[1]).format('YYYY-MM-DD HH:mm'),
    });
    saveEvent(
      {
        id: data ? data.id : null,
        params: {
          ...inputs,
          event_date: [
            moment(inputs.event_date[0]).format('YYYY-MM-DD HH:mm') as unknown,
            moment(inputs.event_date[1]).format('YYYY-MM-DD HH:mm') as unknown,
          ] as [Date, Date],
        },
      },
      {
        onSettled: () => {
          handleModalClose();
          form.reset();
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        <FormField
          control={form.control}
          name='event_date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Date</FormLabel>
              <FormControl>
                <DateRangePicker
                  format='yyyy-MM-dd hh:mm aa'
                  showMeridian
                  className='!block'
                  menuClassName='!pointer-events-auto'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter Event Title...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Write something...'
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='background_color'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div>
                  <GradientPicker
                    background={field.value}
                    setBackground={field.onChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='text-right'>
          <Button className='px-20'>Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
