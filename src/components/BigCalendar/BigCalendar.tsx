import React, { useCallback, useState } from 'react';
import { Calendar, momentLocalizer, Event, View } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './BigCalendar.scss';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop<CalendarEvent, Event>(Calendar);

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  color: string;
  allDay?: boolean;
};

const BigCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentView, setCurrentView] = useState<View>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState<CalendarEvent>({
    title: '',
    start: new Date(),
    end: new Date(),
    color: '#3B86FF',
  });

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedReminder, setEditedReminder] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    color: '#add8e6',
  });

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEditedReminder({ ...event });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedReminder({ ...editedReminder, [name]: value });
  };

  const handleEditColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedReminder({ ...editedReminder, color: event.target.value });
  };

  const handleSaveEditedReminder = () => {
    const updatedEvents = events.map((ev) =>
      ev === selectedEvent ? editedReminder : ev
    );
    setEvents(updatedEvents);
    handleCloseEditModal();
  };

  const onView = useCallback((newView: View) => setCurrentView(newView), [setCurrentView]);

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
    <div style={{ height: '70vh', minHeight:'700px' }}>
      <DnDCalendar
        defaultDate={moment().toDate()}
        defaultView="month"
        view={currentView}
        onView={onView}
        localizer={localizer}
        events={events as CalendarEvent[]}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleOpenModal}
        onSelectEvent={handleSelectEvent}
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
        <div className='fixed top-1/2 left-1/2 bg-white p-5 border border-1 border-gray-400 rounded z-50 shadow'
          style={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <h2>Add New Reminder</h2>
          <label>
            Text (max 30 chars):
            <input
              type="text"
              name="title"
              value={newReminder.title ? newReminder.title : ''}
              placeholder='Title'
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
              
                const updatedEnd = new Date(updatedStart.getTime());
              
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

      {isEditModalOpen && selectedEvent && (
        <div>
          <h2>Edit Reminder</h2>
          <label>
            Text (max 30 chars):
            <input
              type="text"
              name="title"
              value={editedReminder.title}
              onChange={handleEditInputChange}
              maxLength={30}
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              name="start"
              value={moment(editedReminder.start).format('YYYY-MM-DD')}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const updatedStart = new Date(editedReminder.start);
                updatedStart.setFullYear(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  selectedDate.getDate()
                );
              
                const updatedEnd = new Date(updatedStart.getTime());
              
                setEditedReminder({ ...newReminder, start: updatedStart, end: updatedEnd });
              }}
            />
          </label>
          <label>
            Time:
            <input
              type="time"
              name="start"
              value={moment(editedReminder.start).format('HH:mm')}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                const updatedStart = new Date(newReminder.start);
                updatedStart.setHours(parseInt(hours, 10));
                updatedStart.setMinutes(parseInt(minutes, 10));
              
                const updatedEnd = new Date(updatedStart.getTime());
              
                setEditedReminder({ ...newReminder, start: updatedStart, end: updatedEnd });
              }}
            /> 
          </label>
          <label>
            Color:
            <input type="color" value={editedReminder.color} onChange={handleEditColorChange} />
          </label>
          <button onClick={handleSaveEditedReminder}>Save Changes</button>
          <button onClick={handleCloseEditModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default BigCalendar;
