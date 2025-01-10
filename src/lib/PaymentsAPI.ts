import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { Payment } from '@/types/Payment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const getPayments = async (
  page: number = 1,
  pageSize: number = 10,
  filter = '',
  sortColumn = '',
  sortDesc = false
): Promise<{ data: Payment[]; last_page: number }> => {
  const response = await api.get<{ data: { data: Payment[]; current_page: number; last_page: number; total: number } }>(`/api/payments`, {
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

export const usePayments = (
  page: number = 1,
  pageSize: number = 10,
  globalFilter = '',
  sortColumn = '',
  sortDesc = false
) =>
  useQuery({
    queryKey: ['payments', page, pageSize, globalFilter, sortColumn, sortDesc],
    queryFn: async (): Promise<{ data: Payment[]; last_page: number }> => {
      return await getPayments(page, pageSize, globalFilter, sortColumn, sortDesc);
    },
  });