import {
  Appointment,
  AppointmentApprovalsPaginatedData,
  AppointmentPaginatedData,
  ScheduleAppointmentState,
} from '@/types/Appointment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import Pagination from '@/types/Pagination';
import { AppointmentApprovalInputs } from '@/app/(protected)/view-appointments/components/AppointmentsTable';
import { DoctorAppointmentApprovalInputs } from '@/app/(protected)/doctor-appointment-approvals/components/DoctorAppointmentApprovalsTable';

export const getAppointments = async (
  params: Pagination
): Promise<AppointmentPaginatedData> => {
  const { data } = await api.get<AppointmentPaginatedData>(
    '/api/appointments',
    {
      params: params,
    }
  );
  return data;
};

export const getAppointmentApprovals = async (
  params: Pagination
): Promise<AppointmentApprovalsPaginatedData> => {
  const { data } = await api.get<AppointmentApprovalsPaginatedData>(
    `/api/appointment-approvals`,
    {
      params: params,
    }
  );
  return data;
};

export const createAppointment = async (
  doctor_id: string,
  params: Omit<
    ScheduleAppointmentState,
    'activeStep' | 'isFirstStep' | 'isLastStep'
  >
): Promise<Response> => {
  const { data } = await api.post<Response>(`/api/appointments`, {
    doctor_id,
    ...params,
  });
  return data;
};

export const updateAppointmentStatus = async (
  id: string,
  inputs: DoctorAppointmentApprovalInputs
): Promise<Response> => {
  const { data } = await api.patch<Response>(`/api/appointments/${id}`, {
    ...inputs,
  });
  return data;
};

export const updateAppointmentApproval = async (
  id: string,
  inputs: DoctorAppointmentApprovalInputs
): Promise<Response> => {
  const { data } = await api.patch<Response>(
    `/api/appointment-approvals/${id}`,
    {
      ...inputs,
    }
  );
  return data;
};

/* HOOKS */

export const useGetAppointments = (params: Pagination) =>
  useQuery({
    queryKey: ['appointments', params],
    queryFn: async (): Promise<AppointmentPaginatedData> =>
      await getAppointments(params),
  });

export const useGetAppointmentApprovals = (params: Pagination) =>
  useQuery({
    queryKey: ['appointment_approvals', params],
    queryFn: async (): Promise<AppointmentApprovalsPaginatedData> =>
      await getAppointmentApprovals(params),
  });

export const useCreateAppointment = () =>
  useMutation({
    mutationFn: async ({
      doctor_id,
      params,
    }: {
      doctor_id: string;
      params: Omit<
        ScheduleAppointmentState,
        'activeStep' | 'isFirstStep' | 'isLastStep'
      >;
    }) => {
      return await createAppointment(doctor_id, params);
    },
    onSuccess: (response) => {
      if (response.success)
        toast({
          variant: 'success',
          description: response.message,
        });
    },
  });

export const useUpdateAppointmentStatus = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      inputs,
    }: {
      id: string;
      inputs: DoctorAppointmentApprovalInputs;
    }) => {
      return await updateAppointmentStatus(id, inputs);
    },
    onSuccess: (response) => {
      if (response.success)
        toast({
          variant: 'success',
          description: response.message,
        });
    },
    onSettled: () => {
      client.invalidateQueries({
        queryKey: ['appointments'],
      });
    },
  });
};

export const useUpdateAppointmentApproval = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      inputs,
    }: {
      id: string;
      inputs: AppointmentApprovalInputs;
    }) => {
      return await updateAppointmentApproval(id, inputs);
    },
    onSuccess: (response) => {
      if (response.success)
        toast({
          variant: 'success',
          description: response.message,
        });
    },
    onSettled: () => {
      client.invalidateQueries({
        queryKey: ['appointment_approvals'],
      });
    },
  });
};
/* END HOOKS */
