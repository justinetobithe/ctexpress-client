import { Trip } from "./Trip";
import User from "./User";

export interface Booking {
    id?: number;
    user_id: number;
    trip_id: number;
    booked_at?: string;
    status?: string;
    paid?: boolean | number;
    drop_at?: string | null;

    user?: User;
    trip?: Trip;
}
