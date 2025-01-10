import Doctor from './Doctor';
import { Mother } from './Mother';
import { Payment } from './Payment';
import { Remark } from './Remark';
import User from './User';

export interface Appointment {
  id: number;
  mother_id: number;
  doctor_id: number;
  room_id: string;
  host_code: string;
  guest_code: string;
  type: string;
  starts_at: string;
  ends_at: string;
  rejected_reason: string | null;
  patient_name?: string;
  status?: 'pending' | 'confirmed' | 'rejected';
  message: string;
  appointment_date?: string;
  gcash_reference_no?: string;
  doctor_fee: number;
  payments?: Payment[];
  admin_remarks?: Remark[];
  doctor?: {
    id: string,
    user?: User
  }
}

export interface AppointmentApproval {
  id: number;
  status?: 'pending' | 'confirmed' | 'rejected';
  doctor_name?: string;
  doctor_fee: number;
  payments?: Payment[];
  created_at: string;
}

export type MotherAppointment = Appointment &
  Doctor & {
    backgroundColor: string | null;
  };

export type DoctorAppointment = Appointment &
  Mother & {
    backgroundColor: string | null;
  };

export interface AppointmentPaginatedData {
  data: Appointment[];
  last_page: number;
}

export interface AppointmentApprovalsPaginatedData {
  data: AppointmentApproval[];
  last_page: number;
}

// STATE
export interface ScheduleAppointmentState {
  activeStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  message: string | null;
  date: string | null;
  time: [string, string] | null;
  reference_no: string | null;
}

// ACTIONS
export interface ScheduleAppointmentActions {
  setActiveStep: (value: number) => void;
  setIsFirstStep: (value: boolean) => void;
  setIsLastStep: (value: boolean) => void;
  setMessage: (value: string) => void;
  setDate: (value: string) => void;
  setTime: (value: [string, string] | null) => void;
  setReferenceNo: (value: string) => void;
}
