import { Appointment } from './Appointment';
import { Mother } from './Mother';
import User from './User';

export interface Payment {
  id: string;
  morphable_type?: string;
  morphable_id?: 1;
  reference_no: string;
  amount: number;
  created_at: string;
  morphable?: PaymentMorphable;
}

export interface PaymentRemark {
  id: string;
  message: string;
}

export interface PaymentMorphable {
  appointment?: Appointment;
  mother?: {
    id: string;
    user?: User;
  };
}

export interface PaymentPaginatedData {
  data: Payment[];
  last_page: number;
}
