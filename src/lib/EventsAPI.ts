import { EventFormInputs } from '@/app/(protected)/calendar/components/EventForm';
import Response from '@/types/Response';
import { api } from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { Event } from '@/types/Event';

export const getEvents = async (): Promise<Event[]> => {
  const { data } = await api.get('/api/events');
  return data;
};

export const saveEvent = async (
  id: string | null = null,
  params: EventFormInputs
): Promise<Response> => {
  if (id) {
    const { data } = await api.patch(`/api/events/${id}`, params);
    return data;
  }

  const { data } = await api.post('/api/events', params);
  return data;
};

/* HOOKS */
export const useGetEvents = () =>
  useQuery({
    queryKey: ['events'],
    queryFn: async (): Promise<Event[]> => getEvents(),
  });

export const useSaveEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      params,
    }: {
      id: string | null;
      params: EventFormInputs;
    }): Promise<Response> => saveEvent(id, params),
    onSuccess: (response) => {
      toast({
        variant: 'success',
        description: response.message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
      });
    },
  });
};
