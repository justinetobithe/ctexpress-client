import { Trip } from "./Trip";

export interface Kiosk {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    trip_id: number;
    payment_method: string;
    amount_to_pay: number;
    paid?: number | boolean;
    date?: string;
    trip?: Trip;
}