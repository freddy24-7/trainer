import { CalendarDate } from '@heroui/react';

export const convertCalendarDateToDate = (calendarDate: CalendarDate): Date => {
  return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
};
