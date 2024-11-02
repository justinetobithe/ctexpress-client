import { StateSlice } from '@/types/store';
import {
  ScheduleAppointmentState,
  ScheduleAppointmentActions,
} from '@/types/Appointment';

const createScheduleAppointmentSlice: StateSlice<
  ScheduleAppointmentState & ScheduleAppointmentActions
> = (set) => ({
  activeStep: 0,
  isFirstStep: false,
  isLastStep: false,
  message: null,
  date: null,
  time: null,
  reference_no: null,
  setActiveStep: (value: number) =>
    set((state) => {
      state.schedule_appointments.activeStep = value;
    }),
  setIsFirstStep: (value: boolean) =>
    set((state) => {
      state.schedule_appointments.isFirstStep = value;
    }),
  setIsLastStep: (value: boolean) =>
    set((state) => {
      state.schedule_appointments.isLastStep = value;
    }),
  setMessage: (value: string) =>
    set((state) => {
      state.schedule_appointments.message = value;
    }),
  setDate: (value: string) =>
    set((state) => {
      state.schedule_appointments.date = value;
    }),
  setTime: (value: [string, string] | null) =>
    set((state) => {
      state.schedule_appointments.time = value;
    }),
  setReferenceNo: (value: string) =>
    set((state) => {
      state.schedule_appointments.reference_no = value;
    }),
});

export default createScheduleAppointmentSlice;
