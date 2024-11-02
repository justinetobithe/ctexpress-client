'use client';
import React, { FC } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Event } from '@/types/Event';

const Calendar: FC<{
  data: Event[];
}> = ({ data }) => {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        events={data.map((item) => ({
          title: item.title,
          start: item.starts_at,
          end: item.ends_at,
          backgroundColor: item.background_color,
          description: item.description,
        }))}
        headerToolbar={{
          start: '',
          center: 'title',
          end: 'prev,next',
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          meridiem: true,
          hour12: true,
        }}
        eventDisplay='block'
        displayEventEnd
      />
    </div>
  );
};

export default Calendar;
