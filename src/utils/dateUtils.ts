import { CalendarDate } from '@nextui-org/react';

type DateInput = Date | string | CalendarDate;

/**
 * Converts a CalendarDate to a Date object
 */
export function calendarDateToDate(date: CalendarDate): Date {
  return new Date(date.toString());
}

/**
 * Converts a date to UTC, removing any timezone offset
 */
export function toUTCDate(date: DateInput): Date {
  const d =
    date instanceof Date
      ? date
      : typeof date === 'string'
        ? new Date(date)
        : calendarDateToDate(date);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

/**
 * Checks if a date is today or in the past
 */
export function isDateValidForMatch(date: DateInput): boolean {
  const today = toUTCDate(new Date());
  const checkDate = toUTCDate(date);
  return checkDate <= today;
}
