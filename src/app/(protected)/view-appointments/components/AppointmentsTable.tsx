'use client';
import React, { useEffect, useState } from 'react';
import {
  ColumnDef,
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetAppointments,
  useUpdateAppointmentStatus,
} from '@/lib/AppointmentAPI';
import { Appointment } from '@/types/Appointment';
import AppTable from '@/components/AppTable';
import log from '@/utils/logger';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import z from 'zod';
import { strings } from '@/utils/strings';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Gcash from '@public/img/gcash.jpg';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import AppSpinner from '@/components/AppSpinner';

const inputSchema = z
  .object({
    status: z.enum(['confirmed', 'rejected'], {
      required_error: strings.validation.required,
    }),
    reference_no: z
      .string({
        required_error: strings.validation.required,
      })
      .optional(),
    rejected_reason: z
      .string({
        required_error: strings.validation.required,
      })
      .optional(),
  })
  .refine(
    ({ status, reference_no }) => {
      console.log('reference_no', reference_no);
      if (status == 'confirmed' && !reference_no) {
        return false;
      }

      return true;
    },
    {
      path: ['reference_no'],
      message: strings.validation.required,
    }
  )
  .refine(
    ({ status, rejected_reason }) => {
      if (status == 'rejected' && !rejected_reason) {
        return false;
      }

      return true;
    },
    {
      path: ['rejected_reason'],
      message: strings.validation.required,
    }
  );

export type AppointmentApprovalInputs = z.infer<typeof inputSchema>;

export default function AppointmentsTable() {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useGetAppointments({
    page: pageIndex + 1,
    pageSize: pageSize,
    search: searchKeyword,
    sortColumn: sorting.map((item) => item.id).join(','),
    sortDesc: Boolean(sorting.map((item) => item.desc).join(',')),
  });

  const form = useForm<AppointmentApprovalInputs>({
    reValidateMode: 'onSubmit',
    resolver: zodResolver(inputSchema),
  });

  const [rowSelection, setRowSelection] = useState({});

  const { mutate, isPending } = useUpdateAppointmentStatus();

  const handleDialogStateChange = () => {
    setIsOpen((state) => !state);
  };

  /* EFFECTS */
  useEffect(() => {
    if (!isOpen) {
      form.resetField('reference_no');
    }
  }, [isOpen]);

  /* HANDLERS */
  const onSubmit = (inputs: AppointmentApprovalInputs, id: string) => {
    log('[id]', { inputs, id });
    mutate(
      {
        id: id,
        inputs,
      },
      {
        onSettled: () => {
          handleDialogStateChange();
        },
      }
    );
  };

  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: 'patient_name',
      header: () => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
        >
          Patient's Name
        </Button>
      ),
      cell: ({ row }) => {
        const appointment = row.original;
        return <div>{appointment.patient_name}</div>;
      },
    },
    {
      accessorKey: 'message',
      header: () => (
        <Button
          variant='ghost'
          className='pl-0 text-center hover:!bg-transparent'
        >
          Patient's Message
        </Button>
      ),
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='ghost' className='text-primary'>
                  VIEW MESSAGE
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Message</AlertDialogTitle>
                  <AlertDialogDescription>
                    {appointment.message}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
    {
      accessorKey: 'payments',
      header: () => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
        >
          Patient's Payment Reference No.(s)
        </Button>
      ),
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div>
            {appointment.payments?.map((item) => item.reference_no).join(',')}
          </div>
        );
      },
    },
    {
      accessorKey: 'payments',
      header: () => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
        >
          Admin Remarks
        </Button>
      ),
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='ghost' className='text-primary'>
                  VIEW
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remarks</AlertDialogTitle>
                  <AlertDialogDescription className='space-y-5'>
                    {appointment.admin_remarks?.map((item, index) => (
                      <p key={index}>
                        <p>Message: {item.remarks}</p>
                        <p>Date: {item.created_at}</p>
                      </p>
                    ))}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
    {
      accessorKey: 'appointment_date',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
          onClick={() => column.toggleSorting()}
        >
          Appointment Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const appointment = row.original;
        return <div>{appointment.appointment_date}</div>;
      },
    },
    {
      id: 'actions',
      header: () => <div className='text-center'>Actions</div>,
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div className='grid grid-cols-2 gap-2'>
            <Button
              variant='success'
              type='button'
              onClick={() => {
                handleDialogStateChange();
                form.setValue('status', 'confirmed');
              }}
            >
              Accept
            </Button>
            <Button
              variant='destructive'
              type='button'
              onClick={() => {
                handleDialogStateChange();
                form.setValue('status', 'rejected');
              }}
            >
              Reject
            </Button>
            <Dialog open={isOpen} onOpenChange={handleDialogStateChange}>
              <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((inputs) =>
                      onSubmit(inputs, appointment.id.toString())
                    )}
                  >
                    <DialogHeader className='mb-5'>
                      <DialogTitle>
                        Are you sure you want to{' '}
                        {form.watch('status') == 'confirmed'
                          ? 'accept'
                          : 'reject'}{' '}
                        this appointment?
                      </DialogTitle>
                      {form.watch('status') == 'confirmed' ? (
                        <>
                          <DialogDescription>
                            Please pay 20% (₱{appointment.doctor_fee * 0.2})
                            service fee to Nurturemoms first in order to
                            continue
                          </DialogDescription>
                          <div className='relative h-80 p-10'>
                            <Image
                              src={Gcash}
                              fill
                              objectFit='contain'
                              alt='GCASH QR CODE'
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name='reference_no'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reference No.</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter reference no.'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      ) : (
                        <FormField
                          control={form.control}
                          name='rejected_reason'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Why are you rejecting this appointment?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder='Write something.....'
                                  rows={5}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type='button' variant='ghost'>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type='submit' disabled={isPending}>
                        {isPending ? (
                          <>
                            {'Contnue...'} <AppSpinner />
                          </>
                        ) : (
                          'Continue'
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: data ? data.data : Array(10).fill({}),
    columns: isLoading
      ? columns.map((column) => ({
          ...column,
          cell: () => <Skeleton className='h-12 w-full' />,
        }))
      : columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearchKeyword,
    pageCount: data?.last_page ?? -1,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    state: {
      sorting,
      rowSelection,
      pagination,
      globalFilter: searchKeyword,
    },
  });

  return <AppTable table={table} />;
}
