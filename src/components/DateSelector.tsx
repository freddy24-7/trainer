import { DatePicker, CalendarDate } from '@nextui-org/react';
import React from 'react';
import { toast } from 'react-toastify';

import {
  matchDateLabel,
  selectMatchDateLabel,
  futureDateError,
} from '@/strings/clientStrings';
import { DateSelectorProps } from '@/types/ui-types';

const DateSelector: React.FC<DateSelectorProps> = ({
  matchDate,
  onDateChange,
}) => {
  const today = new Date();

  const isDateValid = (date: CalendarDate): boolean => {
    const selectedDate = new Date(date.toString());
    return selectedDate <= today;
  };

  return (
    <div>
      <label className="block mb-2 mx-auto text-center">{matchDateLabel}</label>
      <DatePicker
        label={selectMatchDateLabel}
        className="max-w-[284px]"
        onChange={(date) => {
          if (isDateValid(date as CalendarDate)) {
            onDateChange(date as CalendarDate);
          } else {
            toast.error(futureDateError);
          }
        }}
        value={matchDate}
      />
    </div>
  );
};

export default DateSelector;
