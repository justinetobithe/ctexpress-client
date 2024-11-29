
import { Terminal } from "./Terminal";
import User from "./User";
import { Vehicle } from "./Vehicle";

export interface Trip {
    id?: number;
    driver_id?: number;
    from_terminal_id: number;
    to_terminal_id: number;
    passenger_capacity: string;
    start_time: string;
    trip_date: string;
    fare_amount: string;
    status: string;

    terminal_from?: Terminal;
    terminal_to?: Terminal;

    driver?: User;
    // vehicle?: Vehicle;

    // vehicle?: Vehicle;

    remaining_capacity?: number;
}
