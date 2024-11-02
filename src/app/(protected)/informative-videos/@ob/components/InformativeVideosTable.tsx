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
import { ArrowUpDown, Pencil, Trash } from 'lucide-react';
import moment from 'moment';
import {
  useDeleteInformativeVideo,
  useGetInformativeVideos,
} from '@/lib/InformativeVideosAPI';
import { InformativeVideo } from '@/types/InformativeVideo';
import Link from 'next/link';
import InformativeVideoForm from './InformativeVideoForm';
import AppConfirmationDialog from '@/components/AppConfirmationDialog';

export default function InformativeVideosTable() {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading } = useGetInformativeVideos({
    page: pageIndex + 1,
    pageSize: pageSize,
    search: searchKeyword,
    sortColumn: sorting.map((item) => item.id).join(','),
    sortDesc: Boolean(sorting.map((item) => item.desc).join(',')),
  });

  const { mutate: deleteInformativeVideo } = useDeleteInformativeVideo();

  const [rowSelection, setRowSelection] = useState({});
  const columns: ColumnDef<InformativeVideo>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
          onClick={() => column.toggleSorting()}
        >
          Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return <div>{item.title}</div>;
      },
      enableSorting: true,
    },
    {
      accessorKey: 'link',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
          onClick={() => column.toggleSorting()}
        >
          Link
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            <Link href={item.link} target='_blank' className='text-primary'>
              {item.link}
            </Link>
          </div>
        );
      },
      enableSorting: true,
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
    {
      id: 'actions',
      header: () => <div className='text-center'>Actions</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className='grid grid-cols-2 space-x-1 text-center'>
            <InformativeVideoForm
              isEdit
              buttonTrigger={
                <Button className='w-[40px] h-[40px] p-1 text-2xl'>
                  <Pencil />
                </Button>
              }
              data={item}
            />
            <AppConfirmationDialog
              buttonElem={
                <Button className='w-[40px] h-[40px] p-1 text-2xl'>
                  <Trash />
                </Button>
              }
              handleDialogAction={() => deleteInformativeVideo(item.id)}
            />
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
