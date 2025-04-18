import React, { createContext, useEffect, useState } from 'react';
import { CalendarEvent } from '../types/CalendarEventsType';

type EventsContextType = {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
};

export const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    console.log('storedEvents:', storedEvents);
    if (storedEvents) {
      try {
        const parsed = JSON.parse(storedEvents) as CalendarEvent[];
        const parsedWithDates = parsed.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(parsedWithDates);
      } catch (e) {
        console.error('Error with parsing events:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      {children}
    </EventsContext.Provider>
  );
};
