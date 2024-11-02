'use client';
import React from 'react';
import Calendar from './Calendar';
import EventList from './EventList';
import { useGetEvents } from '@/lib/EventsAPI';

const Main = () => {
  const { data } = useGetEvents();

  return (
    <section>
      {/* LIST OF APPOINTMENTS */}
      <div className='flex flex-col space-y-5 sm:flex-row sm:space-x-5 sm:space-y-0'>
        <div className='sm:w-1/4'>
          {data ? <EventList data={data} /> : null}
        </div>
        <div className='sm:w-3/4'>{data ? <Calendar data={data} /> : null}</div>
      </div>
    </section>
  );
};

export default Main;
