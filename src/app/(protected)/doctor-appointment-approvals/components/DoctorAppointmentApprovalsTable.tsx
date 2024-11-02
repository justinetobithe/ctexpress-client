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
  useGetAppointmentApprovals,
  useUpdateAppointmentApproval,
} from '@/lib/AppointmentAPI';
import { Appointment, AppointmentApproval } from '@/types/Appointment';
import AppTable from '@/components/AppTable';
import log from '@/utils/logger';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { strings } from '@/utils/strings';
import { zodResolver } from '@hookform/resolvers/zod';
import AppSpinner from '@/components/AppSpinner';

const inputSchema = z
  .object({
    status: z.enum(['confirmed', 'rejected'], {
      required_error: strings.validation.required,
    }),
    remarks: z
      .string({
        required_error: strings.validation.required,
      })
      .optional(),
  })
  .refine(
    ({ status, remarks }) => {
      if (status == 'rejected' && !remarks) {
        return false;
      }

      return true;
    },
    {
      path: ['remarks'],
      message: strings.validation.required,
    }
  );

export type DoctorAppointmentApprovalInputs = z.infer<typeof inputSchema>;

export default function DoctorAppointmentApprovalsTable() {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useGetAppointmentApprovals({
    page: pageIndex + 1,
    pageSize: pageSize,
    search: searchKeyword,
    sortColumn: sorting.map((item) => item.id).join(','),
    sortDesc: Boolean(sorting.map((item) => item.desc).join(',')),
  });

  const [rowSelection, setRowSelection] = useState({});

  const { mutate, isPending } = useUpdateAppointmentApproval();

  /* EFECTS */
  useEffect(() => {
    if (!isOpen) {
      form.resetField('remarks');
    }
  }, [isOpen]);

  const handleDialogStateChange = () => {
    setIsOpen((state) => !state);
  };

  const form = useForm<DoctorAppointmentApprovalInputs>({
    resolver: zodResolver(inputSchema),
  });

  /* HANDLERS */
  const onSubmit = (inputs: DoctorAppointmentApprovalInputs, id: string) => {
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

  const columns: ColumnDef<AppointmentApproval>[] = [
    {
      accessorKey: 'doctor_name',
      header: () => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
        >
          Doctor's Name
        </Button>
      ),
      cell: ({ row }) => {
        const appointment = row.original;
        return <div className=''>{appointment.doctor_name}</div>;
      },
    },
    {
      accessorKey: 'doctor_fee',
      header: () => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
        >
          Doctor's Fee
        </Button>
      ),
      cell: ({ row }) => {
        const appointment = row.original;
        return <div className=''>₱{appointment.doctor_fee}</div>;
      },
    },
    {
      accessorKey: 'payments',
      header: () => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
        >
          Payments
        </Button>
      ),
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div className='space-y-5'>
            {appointment.payments?.map((item) => (
              <div key={item.id}>
                <p>Amount: ₱{item.amount} (Doctor's Fee 20%)</p>
                <p>Reference #: {item.reference_no}</p>
                <p>Date: {item.created_at}</p>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
          onClick={() => column.toggleSorting()}
        >
          Date Created
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const appointment = row.original;
        return <div className=''>{appointment.created_at}</div>;
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
              onClick={() => {
                handleDialogStateChange();
                form.setValue('status', 'confirmed');
              }}
            >
              Approve
            </Button>
            <Button
              variant='destructive'
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
                          ? 'approve'
                          : 'reject'}{' '}
                        this appointment?
                      </DialogTitle>
                      <DialogDescription>
                        This action can't be undone
                      </DialogDescription>
                      {form.watch('status') == 'rejected' ? (
                        <FormField
                          control={form.control}
                          name='remarks'
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
                      ) : null}
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
