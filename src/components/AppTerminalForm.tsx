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
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useCreateTerminal, useUpdateTerminal } from '@/lib/TerminalAPI';
import AppSpinner from './AppSpinner';
import { QueryClient } from '@tanstack/react-query';
import { Terminal } from '@/types/Terminal';
import { zodResolver } from '@hookform/resolvers/zod';

const terminalSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3, { message: 'Name is required' }),
    longitude: z.string().min(3, { message: 'Longitude must be between -180 and 180' }).max(180),
    latitude: z.string().min(3, { message: 'Latitude must be between -90 and 90' }).max(90),
});

export type TerminalInput = z.infer<typeof terminalSchema>;

interface AppTerminalFormProps {
    data?: Terminal;
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}

const AppTerminalForm: FC<AppTerminalFormProps> = ({ data, isOpen, onClose, queryClient }) => {
    const [loading, setLoading] = useState(false);

    const form = useForm<TerminalInput>({
        resolver: zodResolver(terminalSchema),
        defaultValues: {
            id: data?.id,
            name: data?.name || '',
            longitude: data?.longitude || '',
            latitude: data?.latitude || '',
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                name: data.name,
                longitude: data.longitude,
                latitude: data.latitude,
            });
        }
    }, [data, form]);

    const { mutate: createTerminal, isPending: isCreating } = useCreateTerminal();
    const { mutate: updateTerminal, isPending: isUpdating } = useUpdateTerminal();

    const onSubmit = async (formData: TerminalInput) => {
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
        } else {
            await createTerminal(formData, {
                onSettled: () => {
                    onClose();
                    queryClient.invalidateQueries({ queryKey: ['trips'] });
                },
            });
        }
        setLoading(false);
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{data ? 'Edit Terminal' : 'Add Terminal'}</AlertDialogTitle>
                </AlertDialogHeader>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='longitude'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Longitude</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='latitude'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Latitude</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='mt-5 flex space-x-2'>
                                <Button variant="outline" onClick={onClose}>Close</Button>
                                <Button type="submit" variant="default" className="text-white" disabled={isCreating || isUpdating}>
                                    {loading ? <AppSpinner /> : (data ? 'Save' : 'Add')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AppTerminalForm;
