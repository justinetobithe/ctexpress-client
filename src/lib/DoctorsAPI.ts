import Response from '@/types/Response';
import { api } from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VerificationFormInputs } from '@/app/(protected)/verification/@request/components/VerificationForm';
import { toast } from '@/components/ui/use-toast';
import { DisplayInformationInputs } from '@/app/(protected)/display-information/components/EditInfoForm';
import { DoctorScheduleInputs } from '@/app/(protected)/display-information/components/EditScheduleForm';
import {
  DoctorVerificationRequestsPaginatedData,
  DoctorsPaginatedData,
} from '@/types/Doctor';
import Pagination from '@/types/Pagination';
import { VerificationRequestInputs } from '@/app/(protected)/doctor-validation/components/DoctorValidationTable';

export const checkStatus = async (): Promise<{
  success: boolean;
  status: string | null;
}> => {
  const { data } = await api.get<{
    success: boolean;
    status: string | null;
  }>('/api/doctors/check-status');
  return data;
};

export const checkDoctorVerificationStatus = async (): Promise<{
  success: boolean;
  status: string | null;
}> => {
  const { data } = await api.get<{
    success: boolean;
    status: string | null;
  }>('/api/doctors/check-verification-status');
  return data;
};

export const getVerifiedDoctors = async (
  verified: boolean = true
): Promise<DoctorsPaginatedData> => {
  const { data } = await api.get<DoctorsPaginatedData>(
    `/api/doctors?verified=${verified}`
  );
  return data;
};

export const getPendingDoctors = async (
  params: Pagination
): Promise<DoctorVerificationRequestsPaginatedData> => {
  const { data } = await api.get<DoctorVerificationRequestsPaginatedData>(
    '/api/doctors/pending',
    {
      params: params,
    }
  );
  return data;
};

export const getDoctorsList = async (
  params: Pagination
): Promise<DoctorsPaginatedData> => {
  const { data } = await api.get<DoctorsPaginatedData>('/api/doctors/list', {
    params: params,
  });
  return data;
};

export const getDoctorVerificationRemarks = async (): Promise<{
  message: string | null;
}> => {
  const { data } = await api.get<{
    message: string | null;
  }>('/api/doctors/verification-remarks');
  return data;
};

export const requestVerification = async (
  id: string,
  params: VerificationFormInputs
): Promise<Response> => {
  const fd = new FormData();
  for (const item in params) {
    fd.append(item, params[item as keyof VerificationFormInputs]);
  }
  const { data } = await api.post<Response>(
    `/api/verification-request/${id}`,
    fd,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
};

export const updateDoctorVerificationRequest = async (
  id: string,
  params: VerificationRequestInputs
): Promise<Response> => {
  const { data } = await api.patch<Response>(
    `/api/doctors/update-verification-status/${id}`,
    {
      ...params,
    }
  );
  return data;
};

const updateDoctorStatus = async (
  id: string,
  status: string
): Promise<Response> => {
  const { data } = await api.patch<Response>(
    `/api/doctors/update-status/${id}`,
    {
      status,
    }
  );

  return data;
};

const saveDoctorInfo = async (
  id: string | null,
  inputs: DisplayInformationInputs | DoctorScheduleInputs
): Promise<Response> => {
  const formData = new FormData();
  if (id) {
    formData.append('_method', 'put');
  }
  for (const item in inputs) {
    if ('time_available' in inputs) {
      formData.append('time_start', inputs['time_available'][0]);
      formData.append('time_end', inputs['time_available'][1]);
    }
    formData.append(
      item,
      inputs[item as keyof (DisplayInformationInputs | DoctorScheduleInputs)]
    );
  }

  const { data } = await api.post<Response>(
    id ? `/api/doctors/${id}` : '/api/doctors',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
};

/* HOOKS */
export const useGetDoctors = () =>
  useQuery({
    queryKey: ['doctors'],
    queryFn: async (): Promise<DoctorsPaginatedData> => {
      return await getVerifiedDoctors();
    },
  });

export const useGetPendingDoctors = (params: Pagination) =>
  useQuery({
    queryKey: ['pending-doctors', params],
    queryFn: async (): Promise<DoctorVerificationRequestsPaginatedData> => {
      return await getPendingDoctors(params);
    },
  });

export const useGetDoctorsList = (params: Pagination) =>
  useQuery({
    queryKey: ['doctors-list', params],
    queryFn: async (): Promise<DoctorsPaginatedData> => {
      return await getDoctorsList(params);
    },
  });

export const useSaveDoctorInfo = () =>
  useMutation({
    mutationFn: async ({
      id,
      inputs,
    }: {
      id: string | null;
      inputs: DisplayInformationInputs | DoctorScheduleInputs;
    }) => {
      return await saveDoctorInfo(id, inputs);
    },
    onSuccess: (response) => {
      if (response.success)
        toast({
          variant: 'success',
          description: response.message,
        });
    },
  });

export const useUpdateDoctorStatus = () =>
  useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await updateDoctorStatus(id, status);
    },
    onSuccess: (response) => {
      if (response.success)
        toast({
          variant: 'success',
          description: response.message,
        });
    },
  });

export const useRequestVerification = () =>
  useMutation({
    mutationFn: async ({
      id,
      params,
    }: {
      id: string;
      params: VerificationFormInputs;
    }) => {
      return await requestVerification(id, params);
    },
    onSuccess: (response) => {
      if (response.success)
        toast({
          variant: 'success',
          description: response.message,
        });
    },
  });

export const useUpdateDoctorVerificationRequest = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      inputs,
    }: {
      id: string;
      inputs: VerificationRequestInputs;
    }) => {
      return await updateDoctorVerificationRequest(id, inputs);
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
        queryKey: ['pending-doctors'],
      });
    },
  });
};
/* END HOOKS */
