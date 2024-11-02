'use client';
import React, { useState } from 'react';
import FileUpload from './FileUpload';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { MediaFile } from '@/types/MediaFile';
import { useDeleteMediaFile, useGetMediaFiles } from '@/lib/MediaFilesAPI';
import moment from 'moment';
import { convertBtoMb } from '@/utils/convertBtoMb';
import Link from 'next/link';
import { ACCEPTED_IMAGE_TYPES } from '@/utils/constants';
import Image from 'next/image';
import Pdf from '@public/img/pdf-icon.png';

const MediaFilesTable = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading } = useGetMediaFiles({
    page: pageIndex + 1,
    pageSize: pageSize,
    search: searchKeyword,
    sortColumn: sorting.map((item) => item.id).join(','),
    sortDesc: Boolean(sorting.map((item) => item.desc).join(',')),
  });

  const { mutate: deleteMediaFile } = useDeleteMediaFile();

  const [rowSelection, setRowSelection] = useState({});

  const handleDeleteMediaFile = (id: MediaFile['id']) => {
    deleteMediaFile(id.toString());
  };

  /* EFFECTS */

  /* HANDLERS */

  const columns: ColumnDef<MediaFile>[] = [
    {
      accessorKey: 'name',
      header: () => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
        >
          File
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            <Link href={item.url} target='_blank' className='text-primary'>
              <span className='relative mr-1 inline-block h-10 w-10 align-middle'>
                <Image
                  src={
                    ACCEPTED_IMAGE_TYPES.includes(item.type) ? item.url : Pdf
                  }
                  alt={item.name}
                  objectFit='contain'
                  fill
                />
              </span>{' '}
              {item.name}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: 'size',
      header: () => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
        >
          File Size
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return <div>{convertBtoMb(item.size).toFixed(2)}MB</div>;
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
          Upload Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return <div>{moment(item.created_at).format('LLL')}</div>;
      },
    },
    {
      id: 'actions',
      header: () => <div className='text-center'>Actions</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className=''>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='destructive' className='w-full'>
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteMediaFile(item.id)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
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

  return (
    <div>
      <FileUpload />
      <AppTable table={table} />
    </div>
  );
};

export default MediaFilesTable;
