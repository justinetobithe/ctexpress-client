import { StateCreator } from 'zustand';
import { UserStateDefinition, UserStateActions } from '@/types/User';
import {
  ScheduleAppointmentState,
  ScheduleAppointmentActions,
} from '@/types/Appointment';
import { AppStateActions, AppStateDefinition } from './App';

export interface CombinedState {
  app: AppStateDefinition & AppStateActions;
  user: UserStateDefinition & UserStateActions;
  schedule_appointments: ScheduleAppointmentState & ScheduleAppointmentActions;
}

export type StateSlice<T> = StateCreator<
  CombinedState,
  [['zustand/immer', never]],
  [['zustand/persist', Partial<T>]],
  T
>;
