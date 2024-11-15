import React, { FC, useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Form, FormControl, FormField, FormItem, FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AppSpinner from './AppSpinner';
import { QueryClient } from '@tanstack/react-query';
import { Booking } from '@/types/Booking';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from "@/components/ui/switch";
import Select from "react-select";
import moment from 'moment';

const bookingSchema = z.object({
    id: z.number().optional(),
    status: z.string().optional(),
    paid: z.number().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

interface AppBookingFormProps {
    data?: Booking;
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}

const AppBookingForm: FC<AppBookingFormProps> = ({ data, isOpen, onClose, queryClient }) => {
    const [loading, setLoading] = useState(false);

    const form = useForm<BookingInput>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            id: data?.id,
            status: data?.status ?? 'pending',
            paid: data?.paid ?? 0,
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                status: data.status ?? 'pending',
                paid: data.paid ?? 0,
            });
        }
    }, [data, form]);

    const { mutate: updateTerminal, isPending: isUpdating } = useUpdateTerminal();

    const onSubmit = async (formData: BookingInput) => {
        setLoading(true);

        if (data && data.id) {
            await updateTerminal(
                { id: data.id, terminalData: formData },
                {
                    onSettled: () => {
                        onClose();
                        queryClient.invalidateQueries({ queryKey: ['trips'] });
                    },
                }
            );
        }
        setLoading(false);
    };

    const statusOptions = [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "expired", label: "Expired" },
    ];

    const formattedDate = data?.trip?.trip_date
        ? moment(data.trip.trip_date).format('MMMM D, YYYY h:mm A')
        : 'N/A';

    const formattedTime = data?.trip?.start_time
        ? moment(data.trip.start_time, ['HH:mm', 'HH:mm:ss']).format('h:mm A')
        : 'Invalid time';

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Booking</AlertDialogTitle>
                </AlertDialogHeader>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            <FormItem>
                                <FormLabel>User</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        value={`${data?.user?.first_name ?? ''} ${data?.user?.last_name ?? ''}`}
                                        disabled
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <FormItem>
                                <FormLabel>Booked at</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        value={data?.trip?.trip_date ? moment(data.trip.trip_date).format('MMMM D, YYYY') : 'N/A'}
                                        disabled
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <FormItem>
                                <FormLabel>Trip</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        value={`${formattedDate} - ${formattedTime}`}
                                        disabled
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <FormItem>
                                <FormLabel>Driver</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        value={`${data?.trip?.driver?.first_name} ${data?.trip?.driver?.last_name}`}
                                        disabled
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <FormField
                                control={form.control}
                                name='status'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <Select
                                                options={statusOptions}
                                                value={statusOptions.find(option => option.value === field.value)}
                                                onChange={option => field.onChange(option?.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='paid'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Paid</FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={field.value == 1 ? true : false}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='mt-5 flex space-x-2'>
                                <Button variant="outline" onClick={onClose}>Close</Button>
                                <Button type="submit" variant="default" className="text-white" disabled={isUpdating}>
                                    {loading ? <AppSpinner /> : 'Update'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AppBookingForm;
