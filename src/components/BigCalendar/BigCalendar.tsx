import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Event, View } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './BigCalendar.scss';
import { ReminderModal } from '../ReminderModal/ReminderModal';
import { useEvents } from '../../hooks/useEvents';
import { CalendarEvent } from '../../types/CalendarEventsType';
import { useSearchParams } from 'react-router-dom';
import { getSearchWith, SearchParams } from '../../utils/getSearchWith';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop<CalendarEvent, Event>(Calendar);

const BigCalendar: React.FC = () => {
  const { events, setEvents } = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewParam = searchParams.get('view') || 'month' as View;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const initialReminder: CalendarEvent = {
    title: '',
    start: new Date(),
    end: new Date(),
    color: '#3B86FF',
    description: '',
  }
  const [newReminder, setNewReminder] = useState<CalendarEvent>(initialReminder);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedReminder, setEditedReminder] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    color: '#add8e6',
  });

  const isValidView = (view: string): view is View => {
    return ['month', 'week', 'work_week', 'day', 'agenda'].includes(view);
  };

  const currentView: View = isValidView(viewParam!) ? viewParam : 'month';

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      console.log('Window clicked', e.clientX, e.clientY); 
      setClickPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  const setSearchWith = (params: SearchParams) => {
    const search = getSearchWith(params, searchParams);
    setSearchParams(search);
  }
  
  const onNavigate = useCallback((date: Date) => setCurrentDate(date), [setCurrentDate]);
  const onView = (newView: View) => {
    setSearchWith({view: newView});
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEditedReminder({ ...event });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveEditedReminder = () => {
    const updatedEvents = events.map((ev) =>
      ev === selectedEvent ? editedReminder : ev
    );
    setEvents(updatedEvents);
    handleCloseEditModal();
  };

  const handleDiscardEditedReminder = () => {
    const updatedEvents = events.filter((ev) => ev !== selectedEvent);
    setEvents(updatedEvents);
    handleCloseEditModal();
  };

  const handleOpenModal = (slotInfo: { start: Date; end: Date }) => {
    setNewReminder({
      ...initialReminder,  
      start: slotInfo.start,
      end: slotInfo.end
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
    <div style={{ height: '70vh', minHeight:'700px', minWidth: '800px' }} className={`custom-calendar ${currentView === 'week' ? 'week-view' : ''} ${currentView === 'day' ? 'day-view' : ''}`}>
      <DnDCalendar
        defaultDate={moment().toDate()}
        defaultView="month"
        view={currentView}
        date={currentDate}
        onNavigate={onNavigate}
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
        <ReminderModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleAddReminder}
          reminder={newReminder}
          setReminder={setNewReminder}
          mode="create"
          position={clickPosition}
        />
      )}

      {isEditModalOpen && selectedEvent && (
        <ReminderModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEditedReminder}
          reminder={editedReminder}
          setReminder={setEditedReminder}
          mode="edit"
          position={clickPosition}
          onDiscard={handleDiscardEditedReminder}
        />
      )}
    </div>
  );
};

export default BigCalendar;
