import { MotherPaginatedData } from '@/types/Mother';
import { api } from './api';
import { useQuery } from '@tanstack/react-query';
import Pagination from '@/types/Pagination';
import { InformativeVideo } from '@/types/InformativeVideo';

export const getMothersList = async (
  params: Pagination
): Promise<MotherPaginatedData> => {
  const { data } = await api.get<MotherPaginatedData>(`/api/mothers`, {
    params: params,
  });
  return data;
};

export const getInformativeVideos = async (): Promise<InformativeVideo[]> => {
  const { data } = await api.get<InformativeVideo[]>(
    `/api/mothers/informative-videos`
  );
  return data;
};

/* HOOKS */
export const useGetMothersList = (params: Pagination) =>
  useQuery({
    queryKey: ['mothers', params],
    queryFn: async (): Promise<MotherPaginatedData> => {
      return await getMothersList(params);
    },
  });

export const useGetInformativeVideos = () =>
  useQuery({
    queryKey: ['informative-videos'],
    queryFn: async (): Promise<InformativeVideo[]> => {
      return await getInformativeVideos();
    },
  });
