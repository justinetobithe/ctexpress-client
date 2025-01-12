import React, { FC, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
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
import { api } from '@/lib/api';
import AppSpinner from './AppSpinner';
import { QueryClient } from '@tanstack/react-query';
import { Driver } from '@/types/Driver';
import { Terminal } from '@/types/Terminal';
import { Trip } from '@/types/Trip';
import { useCreateTrip, useUpdateTrip } from '@/lib/TripAPI';
import {
    Loader
} from 'lucide-react';

const tripSchema = z.object({
    id: z.number().optional(),
    driver_id: z.number().min(1, { message: 'Driver is required' }),
    from_terminal_id: z.number().min(1, { message: 'From Terminal is required' }),
    to_terminal_id: z.number().min(1, { message: 'To Terminal is required' }),
    start_time: z.string().min(1, { message: 'Start time is required' }),
    trip_date: z.string().min(1, { message: 'Trip date is required' }),
    fare_amount: z.string().min(1, { message: 'Fare amount must be a positive number' }),
    status: z.string().min(1, { message: 'Status is required' }),
});

type TripInput = z.infer<typeof tripSchema>;

interface AppTripFormProps {
    data?: Trip;
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}

const AppTripForm: FC<AppTripFormProps> = ({ data, isOpen, onClose, queryClient }) => {
    const [loading, setLoading] = useState(false);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [terminals, setTerminals] = useState<Terminal[]>([]);
    const todayDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await api.get<{ data: Driver[] }>('/api/drivers');
                setDrivers(response.data.data);
            } catch (error) {
                console.error("Error fetching drivers:", error);
            }
        };
        fetchDrivers();
    }, []);

    useEffect(() => {
        const fetchTerminals = async () => {
            try {
                const response = await api.get<{ data: Terminal[] }>('/api/terminals');
                setTerminals(response.data.data);
            } catch (error) {
                console.error("Error fetching terminals:", error);
            }
        };
        fetchTerminals();
    }, []);

    const form = useForm<TripInput>({
        resolver: zodResolver(tripSchema),
        defaultValues: {
            id: data?.id,
            driver_id: data?.driver_id || undefined,
            from_terminal_id: data?.from_terminal_id || undefined,
            to_terminal_id: data?.to_terminal_id || undefined,
            start_time: data?.start_time || '',
            trip_date: data?.trip_date || '',
            fare_amount: data?.fare_amount || '',
            status: data?.status || 'pending',
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                driver_id: data?.driver_id,
                from_terminal_id: data?.from_terminal_id,
                to_terminal_id: data?.to_terminal_id,
                start_time: data?.start_time,
                trip_date: data?.trip_date,
                fare_amount: data?.fare_amount,
                status: data?.status,
            });
        }
    }, [data, form]);

    const { mutate: createTrip, isPending: isCreating } = useCreateTrip();
    const { mutate: updateTrip, isPending: isUpdating } = useUpdateTrip();

    const onSubmit = async (formData: TripInput) => {
        setLoading(true);

        if (data && data.id) {
            await updateTrip(
                { id: data.id, tripData: formData },
                {
                    onSettled: () => {
                        onClose();
                        queryClient.invalidateQueries({ queryKey: ['trips'] });
                    },
                }
            );
        } else {
            await createTrip(formData, {
                onSettled: () => {
                    onClose();
                    queryClient.invalidateQueries({ queryKey: ['trips'] });
                },
            });
        }
        setLoading(false);
    };

    const statusOptions = [
        { value: "pending", label: "Pending" },
        { value: "completed", label: "Completed" },
        { value: "canceled", label: "Canceled" },
        { value: "in_progress", label: "In progress" },
        { value: "failed", label: "Failed" },
    ];

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Add Trip</AlertDialogTitle>
                </AlertDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="driver_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Driver & Vehicle</FormLabel>
                                    <Controller
                                        control={form.control}
                                        name="driver_id"
                                        render={({ field }) => (
                                            <Select
                                                value={drivers.find(driver => driver.id === field.value) ? {
                                                    value: field.value,
                                                    label: `${drivers.find(driver => driver.id === field.value)?.first_name} ${drivers.find(driver => driver.id === field.value)?.last_name} - ${drivers.find(driver => driver.id === field.value)?.vehicle?.brand} ${drivers.find(driver => driver.id === field.value)?.vehicle?.model} (${drivers.find(driver => driver.id === field.value)?.vehicle?.license_plate})`,
                                                } : null}
                                                options={drivers.map(driver => ({
                                                    value: driver.id!,
                                                    label: `${driver.first_name} ${driver.last_name} - ${driver?.vehicle?.brand} ${driver?.vehicle?.model} (${driver?.vehicle?.license_plate})`,
                                                }))}
                                                onChange={option => field.onChange(option?.value)}
                                                isClearable
                                            />
                                        )}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="from_terminal_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>From Terminal</FormLabel>
                                    <Controller
                                        control={form.control}
                                        name="from_terminal_id"
                                        render={({ field }) => (
                                            <Select
                                                value={terminals.find(terminal => terminal.id === field.value) ? {
                                                    value: field.value,
                                                    label: terminals.find(terminal => terminal.id === field.value)?.name,
                                                } : null}
                                                options={terminals
                                                    .filter(terminal => terminal.id !== form.watch('to_terminal_id'))
                                                    .map(terminal => ({
                                                        value: terminal.id!,
                                                        label: terminal.name,
                                                    }))}
                                                onChange={option => field.onChange(option?.value)}
                                                isClearable
                                            />
                                        )}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="to_terminal_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>To Terminal</FormLabel>
                                    <Controller
                                        control={form.control}
                                        name="to_terminal_id"
                                        render={({ field }) => (
                                            <Select
                                                value={terminals.find(terminal => terminal.id === field.value) ? {
                                                    value: field.value,
                                                    label: terminals.find(terminal => terminal.id === field.value)?.name,
                                                } : null}
                                                options={terminals
                                                    .filter(terminal => terminal.id !== form.watch('from_terminal_id'))
                                                    .map(terminal => ({
                                                        value: terminal.id!,
                                                        label: terminal.name,
                                                    }))}
                                                onChange={option => field.onChange(option?.value)}
                                                isClearable
                                            />
                                        )}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="start_time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="trip_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trip Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} min={todayDate} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fare_amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fare Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {data && (
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <Select
                                                options={statusOptions}
                                                onChange={option => field.onChange(option?.value)}
                                                value={statusOptions.find(option => option.value === field.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}


                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit" variant="default" className="text-white" disabled={isCreating || isUpdating}>
                                {loading ? <AppSpinner /> : (data ? 'Save' : 'Add')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AppTripForm;
