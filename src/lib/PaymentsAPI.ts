import { api } from './api';
import { useQuery } from '@tanstack/react-query';
import Pagination from '@/types/Pagination';
import { PaymentPaginatedData } from '@/types/Payment';

export const getPaymentsList = async (
  params: Pagination
): Promise<PaymentPaginatedData> => {
  const { data } = await api.get<PaymentPaginatedData>(`/api/payments`, {
    params: params,
  });
  return data;
};

/* HOOKS */
export const useGetPaymentsList = (params: Pagination) =>
  useQuery({
    queryKey: ['payments', params],
    queryFn: async (): Promise<PaymentPaginatedData> => {
      return await getPaymentsList(params);
    },
  });
