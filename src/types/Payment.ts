import { Booking } from './Booking';
import { Kiosk } from './Kiosk';
import User from './User';

export interface Payment {
  id: number;
  user_id: number;
  booking_id: number;
  payment_method: string;
  amount: number;
  reference_no?: string;

  booking?: Booking;
  user?: User;

  kiosk?: Kiosk;

} 