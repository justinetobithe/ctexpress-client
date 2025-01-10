
import { Terminal } from "./Terminal";
import User from "./User";
import { Vehicle } from "./Vehicle";

export interface Trip {
    id?: number;
    driver_id?: number;
    from_terminal_id: number;
    to_terminal_id: number;
    start_time: string;
    trip_date: string;
    fare_amount: string;
    status: string;

    terminal_from?: Terminal | undefined;
    terminal_to?: Terminal | undefined;

    total_occupancy?: number;

    driver?: User;
    // vehicle?: Vehicle; 

    remaining_capacity?: number;
}
