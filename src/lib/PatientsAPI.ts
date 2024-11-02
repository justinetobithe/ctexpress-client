import { api } from './api';
import { useQuery } from '@tanstack/react-query';
import Pagination from '@/types/Pagination';
import { PatientPaginatedData } from '@/types/Patient';

export const getPatientsList = async (
  params: Pagination
): Promise<PatientPaginatedData> => {
  const { data } = await api.get<PatientPaginatedData>(`/api/mothers`, {
    params: params,
  });
  return data;
};

/* HOOKS */
export const useGetPatientsList = (params: Pagination) =>
  useQuery({
    queryKey: ['patients', params],
    queryFn: async (): Promise<PatientPaginatedData> => {
      return await getPatientsList(params);
    },
  });
