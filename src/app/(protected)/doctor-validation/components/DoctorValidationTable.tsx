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
import AppTable from '@/components/AppTable';
import log from '@/utils/logger';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DoctorVerificationRequest } from '@/types/Doctor';
import {
  useGetPendingDoctors,
  useUpdateDoctorVerificationRequest,
} from '@/lib/DoctorsAPI';
import moment from 'moment';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import z from 'zod';
import { strings } from '@/utils/strings';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import AppSpinner from '@/components/AppSpinner';
import { convertBtoMb } from '@/utils/convertBtoMb';
import { useRouter } from 'next/navigation';

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

export type VerificationRequestInputs = z.infer<typeof inputSchema>;

export default function DoctorValidationTable() {
  const router = useRouter();
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useGetPendingDoctors({
    page: pageIndex + 1,
    pageSize: pageSize,
    search: searchKeyword,
    sortColumn: sorting.map((item) => item.id).join(','),
    sortDesc: Boolean(sorting.map((item) => item.desc).join(',')),
  });

  const [rowSelection, setRowSelection] = useState({});

  const { mutate, isPending } = useUpdateDoctorVerificationRequest();

  const handleDialogStateChange = () => {
    setIsOpen((state) => !state);
  };

  const form = useForm<VerificationRequestInputs>({
    resolver: zodResolver(inputSchema),
  });

  /* EFFECTS */
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen]);

  /* HANDLERS */
  const onSubmit = (id: string, inputs: VerificationRequestInputs) => {
    log('[id]', { id, inputs });
    mutate(
      {
        id,
        inputs,
      },
      {
        onSettled: () => {
          handleDialogStateChange();
          form.resetField('remarks');
        },
      }
    );
  };

  const columns: ColumnDef<DoctorVerificationRequest>[] = [
    {
      accessorKey: 'first_name',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
          onClick={() => column.toggleSorting()}
        >
          Doctor{"'"}s Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            {item.first_name} {item.last_name}
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: () => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
        >
          Application Date
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            {item.verification_requests.length
              ? moment(
                  item.verification_requests[
                    item.verification_requests.length - 1
                  ].created_at
                ).format('LLL')
              : ''}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className='text-center'>Actions</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className='grid grid-cols-3 gap-2'>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline'>View Files</Button>
              </DialogTrigger>
              <DialogContent className='max-w-6xl p-10'>
                <div>
                  <h4 className='mb-3 text-5xl'>Files:</h4>
                  <table className='w-full text-left'>
                    <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                      <tr className='flex w-full'>
                        <th className='w-1/3 p-4'>File Name</th>
                        <th className='w-1/3 p-4'>Size</th>
                        <th className='w-1/3 p-4'>Date Uploaded</th>
                      </tr>
                    </thead>
                    <tbody
                      className='bg-grey-light flex w-full flex-col items-center justify-between overflow-y-auto'
                      style={{
                        maxHeight: '50vh',
                      }}
                    >
                      {item.verification_requests.map((item) =>
                        item.images.map((v) => (
                          <tr
                            className='mb-4 flex w-full border-b bg-white hover:cursor-pointer'
                            key={v.id}
                            onClick={() => router.push(v.url)}
                          >
                            <th scope='row' className='w-1/3 break-words p-4'>
                              {v.name}
                            </th>
                            <td className='w-1/3 p-4'>
                              {convertBtoMb(v.size).toFixed(2)}MB
                            </td>
                            <td className='w-1/3 p-4'>
                              {moment(v.created_at).format('LLL')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant='success'
              onClick={() => {
                handleDialogStateChange();
                form.setValue('status', 'confirmed');
              }}
            >
              Accept
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
            <AlertDialog open={isOpen} onOpenChange={handleDialogStateChange}>
              <AlertDialogContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((inputs) =>
                      onSubmit(item.id, inputs)
                    )}
                  >
                    <AlertDialogHeader className='mb-5'>
                      <AlertDialogTitle>
                        Are you sure you want to{' '}
                        {form.watch('status') == 'confirmed'
                          ? 'accept'
                          : 'reject'}{' '}
                        this appointment?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action can{"'"}t be undone
                      </AlertDialogDescription>
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
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel type='button'>
                        Cancel
                      </AlertDialogCancel>
                      <Button type='submit' disabled={isPending}>
                        {isPending ? (
                          <>
                            {'Continue...'} <AppSpinner />
                          </>
                        ) : (
                          'Continue'
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </form>
                </Form>
              </AlertDialogContent>
            </AlertDialog>
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
    pageCount: data?.meta.last_page ?? -1,
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
