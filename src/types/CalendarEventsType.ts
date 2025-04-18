export type CalendarEvent = {
  id: number,
  title: string;
  start: Date;
  end: Date;
  color: string;
  allDay?: boolean;
  description?: string;
};