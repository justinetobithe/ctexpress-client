import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { MediaFilePaginatedData } from '@/types/MediaFile';
import Pagination from '@/types/Pagination';
import Response from '@/types/Response';

export const getMediaFiles = async (
  params: Pagination
): Promise<MediaFilePaginatedData> => {
  const { data } = await api.get<MediaFilePaginatedData>(
    `/api/mothers/media-files`,
    {
      params: params,
    }
  );
  return data;
};

export const deleteMediaFile = async (id: string): Promise<Response> => {
  const { data } = await api.delete(`/api/media-files/${id}`);
  return data;
};

/* HOOKS */
export const useGetMediaFiles = (params: Pagination) =>
  useQuery({
    queryKey: ['mother-media-files', params],
    queryFn: async (): Promise<MediaFilePaginatedData> => {
      return await getMediaFiles(params);
    },
  });

export const useDeleteMediaFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<Response> => deleteMediaFile(id),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['mother-media-files'],
      });
    },
  });
};
