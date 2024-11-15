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
import { Booking } from '@/types/Booking';
import { useBookings } from '@/lib/BookingAPI';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import AppBookingForm from './AppBookingForm';

export default function AppBookingsTable() {
    const queryClient = useQueryClient();
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const { data, isLoading } = useBookings(
        pageIndex + 1,
        pageSize,
        searchKeyword,
        sorting.map((item) => item.id).join(','),
        Boolean(sorting.map((item) => item.desc).join(','))
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'orange';
            case 'approved':
                return 'green';
            case 'expired':
                return 'red';
            default:
                return 'black';
        }
    };

    const handleEditBooking = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsEditDialogOpen(true);
    };

    const columns: ColumnDef<Booking>[] = [
        {
            accessorKey: 'user',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    User
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => `${row.original.user?.first_name} ${row.original.user?.last_name}`,
            enableSorting: true,
        },
        {
            accessorKey: 'booked',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Booked at
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => `${moment(row.original.trip?.trip_date).format('MMMM D, YYYY')}`,
            enableSorting: true,
        },
        {
            accessorKey: 'trip',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Trip
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => {
                const tripDate = row.original.trip?.trip_date;
                const startTime = row.original.trip?.start_time;

                const formattedDate = moment(tripDate).format('MMMM D, YYYY h:mm A');
                const formattedTime = startTime ? moment(startTime, ['HH:mm', 'HH:mm:ss']).format('h:mm A') : 'Invalid time';

                return `${formattedDate} - ${formattedTime}`;
            },
            enableSorting: true,
        },
        {
            accessorKey: 'driver',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Driver
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => `${row.original.trip?.driver?.first_name} ${row.original.trip?.driver?.last_name}`,
            enableSorting: true,
        },
        {
            accessorKey: 'paid',
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
            cell: ({ row }) => (
                <span className={row.original.paid === 1 ? 'text-green-600' : 'text-red-600'}>
                    {row.original.paid === 1 ? "Paid" : "Unpaid"}
                </span>
            ),
            enableSorting: true,
        },
        {
            accessorKey: 'status',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Status
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="capitalize" style={{ color: getStatusColor(row.original.status) }}>
                    {row.original.status}
                </span>
            ),
            enableSorting: true,
        },
        {
            id: 'actions',
            header: () => <div className='text-center'>Actions</div>,
            cell: ({ row }) => (
                <div className="flex justify-center items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type='button'
                                    variant="outline"
                                    className="mr-2"
                                    onClick={() => handleEditBooking(row.original)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
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
            {selectedBooking && (
                <AppBookingForm
                    data={selectedBooking}
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    queryClient={queryClient}
                />
            )}
        </div>
    );
}
