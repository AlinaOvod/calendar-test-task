export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  color: string;
  allDay?: boolean;
  description?: string;
};