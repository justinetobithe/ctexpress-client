import { DoctorAppointment } from './Appointment';
import { MediaFile } from './MediaFile';
import User from './User';

export default interface Doctor extends User {
  doctor: {
    id: string;
    user_id: string;
    demographic_info: string;
    medical_school: string;
    residency_training: string;
    address: string;
    gcash_number: string;
    gcash_qr_code: MediaFile;
    doctor_fee: number | null;
    days_available: string;
    time_start: string;
    time_end: string;
    user?: User;
  };
}

export interface DoctorDashboard {
  appointments: DoctorAppointment[];
  patients_count: number;
  pending_appointments_count: number;
}

export interface DoctorVerificationRequest extends User, Doctor {
  verification_requests: {
    id: string;
    user_id: string;
    status: string;
    remarks: string | null;
    created_at: string;
    images: MediaFile[];
  }[];
}

export interface DoctorsPaginatedData {
  data: Doctor[];
  last_page: number;
}

export interface DoctorVerificationRequestsPaginatedData {
  data: DoctorVerificationRequest[];
  meta: {
    last_page: number;
  };
}

// STATE
export interface DoctorStateDefinition {
  data: Doctor | null;
}

// ACTIONS
export interface DoctorStateActions {
  setDoctor: (doctor: Doctor) => void;
}
