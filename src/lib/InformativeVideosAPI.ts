import { api } from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Pagination from '@/types/Pagination';
import { InformativeVideoPaginatedData } from '@/types/InformativeVideo';
import { InformativeVideoInputs } from '@/app/(protected)/informative-videos/@ob/components/InformativeVideoForm';
import Response from '@/types/Response';
import { toast } from '@/components/ui/use-toast';

export const getInformativeVideos = async (
  params: Pagination
): Promise<InformativeVideoPaginatedData> => {
  const { data } = await api.get<InformativeVideoPaginatedData>(
    `/api/informative-videos`,
    {
      params: params,
    }
  );
  return data;
};

export const saveInformativeVideo = async (
  id: string | null = null,
  inputs: InformativeVideoInputs
): Promise<Response> => {
  if (id) {
    const { data } = await api.patch<Response>(
      `/api/informative-videos/${id}`,
      {
        ...inputs,
      }
    );
    return data;
  }

  const { data } = await api.post<Response>(`/api/informative-videos`, {
    ...inputs,
  });
  return data;
};

export const deleteInformativeVideo = async (id: string): Promise<Response> => {
  const { data } = await api.delete<Response>(`/api/informative-videos/${id}`);
  return data;
};

/* HOOKS */
export const useGetInformativeVideos = (params: Pagination) =>
  useQuery({
    queryKey: ['informative-videos', params],
    queryFn: async (): Promise<InformativeVideoPaginatedData> => {
      return await getInformativeVideos(params);
    },
  });

export const useSaveInformativeVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      inputs,
    }: {
      id: string | null;
      inputs: InformativeVideoInputs;
    }): Promise<Response> => saveInformativeVideo(id, inputs),
    onSuccess: (response) => {
      toast({
        variant: 'success',
        description: response.message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['informative-videos'],
      });
    },
  });
};

export const useDeleteInformativeVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<Response> =>
      deleteInformativeVideo(id),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['informative-videos'],
      });
    },
  });
};
