import { CalendarDate } from '@nextui-org/react';
import { TrainingFormValues } from '@/types/type-list';
import { UseFormSetValue } from 'react-hook-form';

export const convertCalendarDateToDate = (calendarDate: CalendarDate): Date => {
  return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
};

export const togglePlayerAbsence = (
  playerData: TrainingFormValues['players'],
  index: number,
  setValue: UseFormSetValue<TrainingFormValues>
) => {
  const currentStatus = playerData[index].absent;
  setValue(`players.${index}.absent`, !currentStatus);
};
