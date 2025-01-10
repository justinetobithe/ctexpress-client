import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { Booking } from '@/types/Booking';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const getBookings = async (
    page: number = 1,
    pageSize: number = 10,
    filter = '',
    sortColumn = '',
    sortDesc = false
): Promise<{ data: Booking[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Booking[]; current_page: number; last_page: number; total: number } }>(`/api/bookings`, {
        params: {
            page,
            ...(pageSize && { page_size: pageSize }),
            ...(filter && { filter }),
            ...(sortColumn && { sort_column: sortColumn }),
            sort_desc: sortDesc,
        },
    });

    const { data } = response.data;

    return {
        data: data.data,
        last_page: data?.last_page,
    };
};

export const updateBooking = async (id: number, inputs: Booking): Promise<Response> => {
    const response = await api.put<Response>(`/api/booking/${id}`, inputs);
    return response.data;
};

export const markAsPaid = async (id: number, paid: number): Promise<Response> => {
    const response = await api.put<Response>(`/api/booking/${id}/paid`, { paid });
    return response.data;
};

export const useBookings = (
    page: number = 1,
    pageSize: number = 10,
    globalFilter = '',
    sortColumn = '',
    sortDesc = false
) =>
    useQuery({
        queryKey: ['bookings', page, pageSize, globalFilter, sortColumn, sortDesc],
        queryFn: async (): Promise<{ data: Booking[]; last_page: number }> => {
            return await getBookings(page, pageSize, globalFilter, sortColumn, sortDesc);
        },
    });

export const useUpdateBooking = () => {
    return useMutation({
        mutationFn: async ({ id, bookingData }: { id: number; bookingData: Booking }) => {
            return await updateBooking(id, bookingData);
        },
        onSuccess: (response) => {
            if (response && response.status === "success") {
                toast({
                    variant: 'success',
                    description: response.message,
                });
            }
        },
    });
};

export const useMarkAsPaid = () => {
    return useMutation({
        mutationFn: async ({ id, paid }: { id: number; paid: number }) => {
            return await markAsPaid(id, paid);
        },
        onSuccess: (response) => {
            if (response && response.status === "success") {
                toast({
                    variant: 'success',
                    description: response.message,
                });
            }
        },
        onError: (error) => {
            toast({
                variant: 'destructive',
                description: error?.message || 'Something went wrong!',
            });
        },
    });
};
