import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { Kiosk } from '@/types/Kiosk';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getKiosks = async (
    page: number = 1,
    pageSize: number = 10,
    filter = '',
    sortColumn = '',
    sortDesc = false
): Promise<{ data: Kiosk[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Kiosk[]; current_page: number; last_page: number; total: number } }>(`/api/kiosks`, {
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

export const createKiosk = async (inputs: Kiosk): Promise<Response> => {
    const response = await api.post<Response>(`/api/kiosk`, inputs);
    return response.data;
};

export const markAsPaid = async (id: number, paid: number): Promise<Response> => {
    const response = await api.put<Response>(`/api/kiosk/${id}/paid`, { paid });
    return response.data;
};

export const useKiosks = (
    page: number = 1,
    pageSize: number = 10,
    globalFilter = '',
    sortColumn = '',
    sortDesc = false
) =>
    useQuery({
        queryKey: ['kiosks', page, pageSize, globalFilter, sortColumn, sortDesc],
        queryFn: async (): Promise<{ data: Kiosk[]; last_page: number }> => {
            return await getKiosks(page, pageSize, globalFilter, sortColumn, sortDesc);
        },
    });

export const useCreateKiosk = () => {
    return useMutation({
        mutationFn: async (inputs: Kiosk) => {
            return await createKiosk(inputs);
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
