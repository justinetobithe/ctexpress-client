import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { Trip } from '@/types/Trip';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getTrips = async (
    page: number = 1,
    pageSize: number = 10,
    filter = '',
    sortColumn = '',
    sortDesc = false
): Promise<{ data: Trip[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Trip[]; current_page: number; last_page: number; total: number } }>(`/api/trips`, {
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

export const createTrip = async (inputs: Trip): Promise<Response> => {
    const response = await api.post<Response>(`/api/trip`, inputs);
    return response.data;
};

export const updateTrip = async (id: number, inputs: Trip): Promise<Response> => {
    const response = await api.put<Response>(`/api/trip/${id}`, inputs);
    return response.data;
};

export const deleteTrip = async (id: number): Promise<Response> => {
    const response = await api.delete(`/api/trip/${id}`);
    return response.data;
};

export const useTrips = (
    page: number = 1,
    pageSize: number = 10,
    globalFilter = '',
    sortColumn = '',
    sortDesc = false
) =>
    useQuery({
        queryKey: ['trips', page, pageSize, globalFilter, sortColumn, sortDesc],
        queryFn: async (): Promise<{ data: Trip[]; last_page: number }> => {
            return await getTrips(page, pageSize, globalFilter, sortColumn, sortDesc);
        },
    });

export const useCreateTrip = () => {
    return useMutation({
        mutationFn: async (inputs: Trip) => {
            return await createTrip(inputs);
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

export const useUpdateTrip = () => {
    return useMutation({
        mutationFn: async ({ id, tripData }: { id: number; tripData: Trip }) => {
            return await updateTrip(id, tripData);
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

export const useDeleteTrip = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await deleteTrip(id);
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
