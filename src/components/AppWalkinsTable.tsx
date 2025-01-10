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
import { ArrowUpDown, Pencil, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Kiosk } from '@/types/Kiosk';
import { markAsPaid, useKiosks, useMarkAsPaid } from '@/lib/KioskAPI';

import AppConfirmationDialog from './AppConfirmationDialog';
import { toast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';

export default function AppWalkinsTable() {
    const queryClient = useQueryClient();
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [sorting, setSorting] = useState<SortingState>([]);

    const { data, isLoading } = useKiosks(
        pageIndex + 1,
        pageSize,
        searchKeyword,
        sorting.map((item) => item.id).join(','),
        Boolean(sorting.map((item) => item.desc).join(','))
    );

    const { mutate: markAsPaid } = useMarkAsPaid();

    const handleMarkAsPaid = (id: number) => {
        markAsPaid({ id, paid: 1 }, {
            onSettled: () => {
                queryClient.invalidateQueries({
                    queryKey: ['kiosks']
                });
            }
        });
    };

    const columns: ColumnDef<Kiosk>[] = [
        {
            accessorKey: 'name',
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
            cell: ({ row }) => row.original.name,
            enableSorting: true,
        },
        {
            accessorKey: 'email',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Email
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.email,
            enableSorting: true,
        },
        {
            accessorKey: 'phone',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Phone
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.phone,
            enableSorting: true,
        },
        {
            accessorKey: 'trip',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="pl-0 text-left hover:!bg-transparent"
                    onClick={() => column.toggleSorting()}
                >
                    Trip
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const trip = row.original.trip;
                const formattedDate = trip?.trip_date ? moment(trip.trip_date).format('MMM DD, YYYY') : '';
                const formattedTime = trip?.start_time ? moment(trip.start_time, 'HH:mm').format('h:mm A') : '';

                return (
                    <span>
                        {trip?.terminal_from?.name} to {trip?.terminal_to?.name} <br />
                        {formattedDate} at {formattedTime}
                    </span>
                );
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
                    Payment
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.payment_method,
            enableSorting: true,
        },
        {
            accessorKey: 'amount_to_pay',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Fare
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.amount_to_pay,
            enableSorting: true,
        },
        {
            accessorKey: 'paid',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="pl-0 text-left hover:!bg-transparent"
                    onClick={() => column.toggleSorting()}
                >
                    Remarks
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span
                    className={`font-medium ${row.original.paid == 1 ? 'text-green-500' : 'text-red-500'
                        }`}
                >
                    {row.original.paid == 1 ? 'Paid' : 'Not Paid'}
                </span>
            ),
            enableSorting: true,
        },
        {
            id: 'actions',
            header: () => <div className='text-center'>Actions</div>,
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex justify-center items-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Dialog>
                                        {item.paid == 0 && (
                                            <AppConfirmationDialog
                                                title="Mark as Paid"
                                                description="Are you sure you want to mark this transaction as paid? This action cannot be undone."
                                                buttonElem={
                                                    <Button
                                                        className="text-white"
                                                        variant="success"
                                                        type='button'
                                                        style={{ marginLeft: '8px' }}
                                                    >
                                                        <CreditCard size={20} />
                                                    </Button>
                                                }
                                                handleDialogAction={() => handleMarkAsPaid(item.id!)}
                                            />
                                        )}
                                    </Dialog>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Mark this transaction as paid
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        }
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
