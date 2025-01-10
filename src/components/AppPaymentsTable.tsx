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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from '@/components/ui/skeleton';
import AppTable from '@/components/AppTable';
import { ArrowUpDown, Pencil, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Payment } from '@/types/Payment';
import { usePayments } from '@/lib/PaymentsAPI';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';

export default function AppTerminalsTable() {
  const queryClient = useQueryClient();
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading } = usePayments(
    pageIndex + 1,
    pageSize,
    searchKeyword,
    sorting.map((item) => item.id).join(','),
    Boolean(sorting.map((item) => item.desc).join(','))
  );

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'user',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
          onClick={() => column.toggleSorting()}
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const kioskName = row.original.kiosk?.name;
        const userFirstName = row.original.user?.first_name;
        const userLastName = row.original.user?.last_name;

        return kioskName
          ? kioskName
          : userFirstName || userLastName
            ? `${userFirstName ?? ''} ${userLastName ?? ''}`.trim()
            : '';
      },
      enableSorting: true,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
          onClick={() => column.toggleSorting()}
        >
          Type
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const hasKiosk = row.original.kiosk;
        const hasBooking = row.original.booking;

        return hasKiosk ? 'Walk ins' : hasBooking ? 'Booking' : '';
      },
      enableSorting: true,
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
          onClick={() => column.toggleSorting()}
        >
          Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const kioskDate = row.original.kiosk?.date;
        const bookingDate = row.original.booking?.booked_at;

        const dateToFormat = kioskDate || bookingDate;

        return dateToFormat
          ? moment(dateToFormat).format('MMM D, YYYY')
          : 'N/A';
      },
      enableSorting: true,
    },
    {
      accessorKey: 'payment_method',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
          onClick={() => column.toggleSorting()}
        >
          Payment Method
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => row.original.payment_method,
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
      cell: ({ row }) => row.original.amount,
      enableSorting: true,
    },
    {
      accessorKey: 'reference_no',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
          onClick={() => column.toggleSorting()}
        >
          Reference No
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => row.original.reference_no || 'N/A',
      enableSorting: true,
    },
  ];


  const pagination = React.useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  const table = useReactTable({
    data: data?.data ?? Array(10).fill({}),
    columns: isLoading
      ? columns.map((column) => ({ ...column, cell: () => <Skeleton className='h-12 w-full' /> }))
      : columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearchKeyword,
    pageCount: data?.last_page ?? -1,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    state: {
      sorting,
      pagination,
      globalFilter: searchKeyword,
    },
  });

  return (
    <div>
      <AppTable table={table} />

    </div>
  );
}
