import { DatePicker, CalendarDate } from '@nextui-org/react';
import React from 'react';

import { DateSelectorProps } from '@/types/ui-types';

const DateSelector: React.FC<DateSelectorProps> = ({
  matchDate,
  onDateChange,
}) => {
  return (
    <div>
      <label className="block mb-2 mx-auto text-center">Match Date:</label>
      <DatePicker
        label="Select Match Date"
        className="max-w-[284px]"
        onChange={(date) => onDateChange(date as CalendarDate)}
        value={matchDate}
      />
    </div>
  );
};

export default DateSelector;
