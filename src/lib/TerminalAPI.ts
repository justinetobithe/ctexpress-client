import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { Terminal } from '@/types/Terminal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const getTerminals = async (
    page: number = 1,
    pageSize: number = 10,
    filter = '',
    sortColumn = '',
    sortDesc = false
): Promise<{ data: Terminal[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Terminal[]; current_page: number; last_page: number; total: number } }>(`/api/terminals`, {
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

export const createTerminal = async (inputs: Terminal): Promise<Response> => {
    const response = await api.post<Response>(`/api/terminal`, inputs);
    return response.data;
};

export const updateTerminal = async (id: number, inputs: Terminal): Promise<Response> => {
    const response = await api.put<Response>(`/api/terminal/${id}`, inputs);
    return response.data;
};

export const deleteTerminal = async (id: number): Promise<Response> => {
    const response = await api.delete(`/api/terminal/${id}`);
    return response.data;
};

export const useTerminals = (
    page: number = 1,
    pageSize: number = 10,
    globalFilter = '',
    sortColumn = '',
    sortDesc = false
) =>
    useQuery({
        queryKey: ['terminals', page, pageSize, globalFilter, sortColumn, sortDesc],
        queryFn: async (): Promise<{ data: Terminal[]; last_page: number }> => {
            return await getTerminals(page, pageSize, globalFilter, sortColumn, sortDesc);
        },
    });

export const useCreateTerminal = () => {
    const queryClient = useQueryClient();
    ``
    return useMutation({
        mutationFn: async (inputs: Terminal) => {
            return await createTerminal(inputs);
        },
        onSuccess: (response) => {
            if (response && response.status === "success") {
                queryClient.invalidateQueries({ queryKey: ['terminals'] });
                toast({
                    variant: 'success',
                    description: response.message,
                });
            }
        },
    });
};

export const useUpdateTerminal = () => {
    return useMutation({
        mutationFn: async ({ id, terminalData }: { id: number; terminalData: Terminal }) => {
            return await updateTerminal(id, terminalData);
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

export const useDeleteTerminal = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await deleteTerminal(id);
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
