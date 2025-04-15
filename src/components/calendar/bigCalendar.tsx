import React, { useState } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop<CalendarEvent, Event>(Calendar);

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  color: string;
};

const BigCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState<CalendarEvent>({
    title: '',
    start: new Date(),
    end: new Date(),
    color: '#add8e6',
  });

  const handleOpenModal = (slotInfo: { start: Date; end: Date }) => {
    setNewReminder({
      ...newReminder,
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewReminder({ ...newReminder, [name]: value });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewReminder({ ...newReminder, color: e.target.value });
  };

  const handleAddReminder = () => {
    setEvents([...events, newReminder]);
    handleCloseModal();
  };

  const onEventDrop: (args: EventInteractionArgs<CalendarEvent>) => void = (args) => {
    const { event, start, end } = args;
  
    const newStart = start instanceof Date ? start : new Date(start);
    const newEnd = end instanceof Date ? end : new Date(end);
  
    const updatedEvents = events.map((existingEvent) =>
      existingEvent === event ? { ...event, start: newStart, end: newEnd } : existingEvent
    );
    setEvents(updatedEvents);
    console.log('onEventDrop', { event, start, end });
  };

  const onEventResize: (args: EventInteractionArgs<CalendarEvent>) => void = (args) => {
    const { event, start, end } = args;
  
    const newStart = start instanceof Date ? start : new Date(start);
    const newEnd = end instanceof Date ? end : new Date(end);
  
    const updatedEvents = events.map((existingEvent) =>
      existingEvent === event ? { ...event, start: newStart, end: newEnd } : existingEvent
    );
    setEvents(updatedEvents);
    console.log('onEventResize', { event, start, end });
  };

  return (
    <div style={{ height: '500px' }}>
      <DnDCalendar
        defaultDate={moment().toDate()}
        defaultView="month"
        localizer={localizer}
        events={events as CalendarEvent[]}
        // startAccessor="start"
        // endAccessor="end"
        selectable
        onSelectSlot={handleOpenModal}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        eventPropGetter={(event: CalendarEvent) => ({
          style: {
            backgroundColor: event.color,
          },
        })}
      />

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #ccc',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
          }}
        >
          <h2>Add New Reminder</h2>
          <label>
            Text (max 30 chars):
            <input
              type="text"
              name="title"
              value={newReminder.title ? newReminder.title : 'title'}
              onChange={handleInputChange}
              maxLength={30}
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              name="start"
              value={moment(newReminder.start).format('YYYY-MM-DD')}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const updatedStart = new Date(newReminder.start);
                updatedStart.setFullYear(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  selectedDate.getDate()
                );
              
                const updatedEnd = new Date(updatedStart.getTime() + 30 * 60 * 1000);
              
                setNewReminder({ ...newReminder, start: updatedStart, end: updatedEnd });
              }}
            />
          </label>
          <label>
            Time:
            <input
              type="time"
              name="start"
              value={moment(newReminder.start).format('HH:mm')}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                const updatedStart = new Date(newReminder.start);
                updatedStart.setHours(parseInt(hours, 10));
                updatedStart.setMinutes(parseInt(minutes, 10));
              
                const updatedEnd = new Date(updatedStart.getTime());
              
                setNewReminder({ ...newReminder, start: updatedStart, end: updatedEnd });
              }}
            />
          </label>
          <label>
            Color:
            <input type="color" value={newReminder.color} onChange={handleColorChange} />
          </label>
          <button onClick={handleAddReminder}>Add Reminder</button>
          <button onClick={handleCloseModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default BigCalendar;
