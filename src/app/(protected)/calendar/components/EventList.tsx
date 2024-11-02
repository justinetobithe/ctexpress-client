import React, { FC, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EventForm from './EventForm';
import { Event } from '@/types/Event';

const EventList: FC<{ data: Event[] }> = ({ data }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className='h-full'>
      <CardContent className='py-5 h-full'>
        <div className='flex space-x-5 h-full'>
          <div className='flex-1 h-full'>
            <ul className='max-h-[900px] space-y-5 overflow-y-auto h-full'>
              {data.map((item) => (
                <li key={item.id}>
                  <Button
                    type='button'
                    variant='ghost'
                    className='font-regular w-full rounded-lg p-3 px-5 text-left text-xs hover:bg-none active:bg-none h-auto'
                    style={{
                      backgroundColor:
                        selectedEvent && selectedEvent?.id == item.id
                          ? 'white'
                          : item.background_color,
                      color:
                        selectedEvent && selectedEvent?.id == item.id
                          ? item.background_color
                          : 'white',
                      fontWeight:
                        selectedEvent && selectedEvent?.id == item.id
                          ? 'bold'
                          : 'normal',
                      border:
                        selectedEvent && selectedEvent?.id
                          ? `1px solid ${item.background_color}`
                          : 'none',
                    }}
                    onClick={() => setSelectedEvent(item)}
                  >
                    {item.title}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className='space-y-3'>
            <div>
              <Button
                variant='outline'
                onClick={() => {
                  setIsOpen((state) => !state);
                  setSelectedEvent(null);
                }}
              >
                ADD EVENT
              </Button>
            </div>
            <div>
              <Button
                variant='outline'
                onClick={() => setIsOpen((state) => !state)}
                disabled={!selectedEvent}
              >
                EDIT EVENT
              </Button>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent
                className='max-w-auto sm:max-w-3xl'
                onInteractOutside={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>
                    {selectedEvent ? 'Edit' : 'Add'} Event
                  </DialogTitle>
                </DialogHeader>
                <EventForm
                  data={selectedEvent}
                  handleModalClose={() => setIsOpen((state) => !state)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventList;
