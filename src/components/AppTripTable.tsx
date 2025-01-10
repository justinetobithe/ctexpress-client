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
import { Trip } from '@/types/Trip';
import { useDeleteVehicle, useUpdateVehicle, useVehicles } from '@/lib/VehicleAPI';
import AppConfirmationDialog from './AppConfirmationDialog';
import { toast } from '@/components/ui/use-toast';
import AppVehicleForm from './AppVehicleForm';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteTrip, useTrips, useUpdateTrip } from '@/lib/TripAPI';
import AppTripForm from './AppTripForm';
import moment from 'moment';


export default function AppVehiclesTable() {
    const queryClient = useQueryClient();
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    const { data, isLoading } = useTrips(
        pageIndex + 1,
        pageSize,
        searchKeyword,
        sorting.map((item) => item.id).join(','),
        Boolean(sorting.map((item) => item.desc).join(','))
    );

    const { mutate } = useDeleteTrip();
    const { mutate: updateTrip } = useUpdateTrip();

    const handleEditTrip = (trip: Trip) => {
        setSelectedTrip(trip);
        setIsEditDialogOpen(true);
    };

    const handleDeleteTrip = (id: number) => {
        mutate(id, {
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['trips'] });
            }
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'orange';
            case 'completed':
                return 'green';
            case 'canceled':
                return 'red';
            case 'in_progress':
                return 'blue';
            case 'failed':
                return 'gray';
            default:
                return 'black';
        }
    };

    const columns: ColumnDef<Trip>[] = [
        {
            accessorKey: 'trip_date',
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
            cell: ({ row }) => moment(row.original.trip_date).format('MMMM DD, YYYY'),
            enableSorting: true,
        },
        {
            accessorKey: 'start_time',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Time
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => moment(row.original.start_time, 'HH:mm:ss').format('hh:mm A'),
            enableSorting: true,
        },
        {
            accessorKey: 'terminal_from',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Terminal From
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.terminal_from?.name,
            enableSorting: true,
        },
        {
            accessorKey: 'terminal_to',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Terminal To
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.terminal_to?.name,
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
            cell: ({ row }) => (
                <div>
                    <span className="font-bold">
                        {row.original.driver?.first_name} {row.original.driver?.last_name}
                    </span>
                    <div className="text-sm text-gray-600 mt-1">
                        <span>
                            {row.original.driver?.vehicle?.license_plate} - {row.original.driver?.vehicle?.brand} {row.original.driver?.vehicle?.model} {row.original.driver?.vehicle?.year}
                        </span>
                    </div>
                </div>
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
                                    onClick={() => handleEditTrip(row.original)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <AppConfirmationDialog
                        title='Delete Trip'
                        description={`Are you sure you want to delete the trip scheduled on "${moment(row.original.trip_date).format('MMMM DD, YYYY')}" starting at "${moment(row.original.start_time, 'HH:mm:ss').format('hh:mm A')}"? This action cannot be undone.`}
                        buttonElem={
                            <Button className="text-white" variant="destructive" type='button'>
                                <Trash size={20} />
                            </Button>
                        }
                        handleDialogAction={() => handleDeleteTrip(row.original.id!)}
                    />
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
            {selectedTrip && (
                <AppTripForm
                    data={selectedTrip}
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    queryClient={queryClient}
                />
            )}
        </div>
    );
}
