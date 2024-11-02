import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Pagination from '@/types/Pagination';
import Response from '@/types/Response';
import { InboxPaginatedData } from '@/types/Inbox';

export const getInboxes = async (
  params: Pagination
): Promise<InboxPaginatedData> => {
  const { data } = await api.get<InboxPaginatedData>(`/api/inboxes`, {
    params: params,
  });
  return data;
};

export const deleteInbox = async (id: string): Promise<Response> => {
  const { data } = await api.delete(`/api/inboxes/${id}`);
  return data;
};

/* HOOKS */
export const useGetInboxes = (params: Pagination) =>
  useQuery({
    queryKey: ['inboxes', params],
    queryFn: async (): Promise<InboxPaginatedData> => {
      return await getInboxes(params);
    },
  });

export const useDeleteInbox = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<Response> => deleteInbox(id),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['inboxes'],
      });
    },
  });
};
