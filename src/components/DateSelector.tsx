import { DatePicker, CalendarDate } from '@nextui-org/react';
import React from 'react';
import { toast } from 'react-toastify';

import {
  matchDateLabel,
  selectMatchDateLabel,
  futureDateError,
} from '@/strings/clientStrings';
import { DateSelectorProps } from '@/types/ui-types';
import { isDateValidForMatch } from '@/utils/dateUtils';

const DateSelector: React.FC<DateSelectorProps> = ({
  matchDate,
  onDateChange,
}) => {
  return (
    <div>
      <label className="block mb-2 mx-auto text-center">{matchDateLabel}</label>
      <DatePicker
        label={selectMatchDateLabel}
        className="max-w-[284px]"
        onChange={(date) => {
          if (date && isDateValidForMatch(date as CalendarDate)) {
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
