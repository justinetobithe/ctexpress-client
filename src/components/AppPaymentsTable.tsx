'use client';
import React, { useState } from 'react';
import {
  ColumnDef,
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AppTable from '@/components/AppTable';
import { ArrowUpDown } from 'lucide-react';
import { useGetPaymentsList } from '@/lib/PaymentsAPI';
import { Payment } from '@/types/Payment';
import moment from 'moment';
import { useSession } from 'next-auth/react';

export default function AppPaymentsTable() {
  const session = useSession();
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading } = useGetPaymentsList({
    page: pageIndex + 1,
    pageSize: pageSize,
    search: searchKeyword,
    sortColumn: sorting.map((item) => item.id).join(','),
    sortDesc: Boolean(sorting.map((item) => item.desc).join(',')),
  });

  const [rowSelection, setRowSelection] = useState({});
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'morphable',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
          onClick={() => column.toggleSorting()}
        >
          {session.data?.user.role == 'admin' ? 'Doctor' : 'Patient'}
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            {item.morphable && item.morphable?.appointment
              ? item.morphable.appointment.doctor?.user?.first_name +
                ' ' +
                item.morphable.appointment.doctor?.user?.last_name
              : item.morphable?.mother?.user?.first_name +
                ' ' +
                item.morphable?.mother?.user?.last_name}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
          onClick={() => column.toggleSorting()}
        >
          Amount
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return <div>₱{item.amount}</div>;
      },
      enableSorting: true,
    },
    {
      accessorKey: 'reference_no',
      header: () => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
        >
          Reference Number
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return <div className='font-bold'>{item.reference_no}</div>;
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
        const item = row.original;
        return <div>{moment(item.created_at).format('LLLL')}</div>;
      },
      enableSorting: true,
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
