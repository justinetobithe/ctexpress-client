import AppDoctorDisplayInfo from '@/components/doctors/AppDoctorDisplayInfo';
import { Label } from '@/components/ui/label';
import Doctor from '@/types/Doctor';
import React, { FC } from 'react';
import useStore from '@/store/useStore';
import moment from 'moment';
import { DatePicker, DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';
import { toast } from '@/components/ui/use-toast';
import { WEEKDAYS } from '@/utils/constants';

const Step2: FC<{ data: Doctor }> = ({ data }) => {
  const { date, time, setDate, setTime } = useStore(
    (state) => state.schedule_appointments
  );

  return (
    <AppDoctorDisplayInfo data={data}>
      <div>
        <Label htmlFor='inputDate' className='mb-3 block text-4xl font-bold'>
          Select Date & Time:
        </Label>
        <div className='w-full'>
          <div className='mb-3'>
            <DatePicker
              format='MM/dd/yyyy'
              onChange={(v) => setDate(moment(v).format('YYYY-MM-DD'))}
              size='lg'
              className='w-full'
              shouldDisableDate={(date) => {
                const weekdays: number[] = [];
                WEEKDAYS.forEach((item) => {
                  if (data.doctor.days_available.includes(item.value)) {
                    weekdays.push(item.weekDay);
                  }
                });

                return (
                  moment().isAfter(moment(date)) ||
                  !weekdays.includes(moment(date).weekday())
                );
              }}
              value={date ? moment(date).toDate() : null}
              oneTap
            />
          </div>
          <DateRangePicker
            format='hh:mm aa'
            onChange={(v) => {
              if (v) {
                if (
                  !moment(moment(v[0]).format('HH:mm'), 'HH:mm').isBetween(
                    moment(data.doctor.time_start, 'HH:mm'),
                    moment(data.doctor.time_end, 'HH:mm'),
                    null,
                    '[]'
                  ) ||
                  !moment(moment(v[1]).format('HH:mm'), 'HH:mm').isBetween(
                    moment(data.doctor.time_start, 'HH:mm'),
                    moment(data.doctor.time_end, 'HH:mm'),
                    null,
                    '[]'
                  )
                ) {
                  toast({
                    description: `Please select between ${moment(
                      data.doctor.time_start,
                      'HH:mm'
                    ).format('hh:mmA')} ~ ${moment(
                      data.doctor.time_end,
                      'HH:mm'
                    ).format('hh:mmA')}`,
                  });
                  return;
                }

                setTime([
                  moment(v[0]).format('HH:mm'),
                  moment(v[1]).format('HH:mm'),
                ]);
              }
            }}
            size='lg'
            showMeridian
            className='w-full'
            ranges={[]}
            value={
              time
                ? [
                    moment(time[0], 'HH:mm').toDate(),
                    moment(time[1], 'HH:mm').toDate(),
                  ]
                : null
            }
          />
        </div>
      </div>
    </AppDoctorDisplayInfo>
  );
};

export default Step2;
