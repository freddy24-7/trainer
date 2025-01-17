import { DatePicker, CalendarDate } from '@nextui-org/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import { futureDateError, pastDateError } from '@/strings/clientStrings';
import { DateProps } from '@/types/shared-types';

const DateField: React.FC<DateProps> = ({ errors, label }) => {
  const { control } = useFormContext();
  const today = new Date();
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(today.getMonth() - 2);

  const isDateValid = (date: CalendarDate): boolean => {
    const selectedDate = new Date(date.year, date.month - 1, date.day);
    return selectedDate <= today && selectedDate >= twoMonthsAgo;
  };

  const convertToISOString = (date: CalendarDate): string => {
    const { year, month, day } = date;
    return new Date(year, month - 1, day).toISOString();
  };

  return (
    <Controller
      name="date"
      control={control}
      render={({ field }) => (
        <div className="w-full max-w-xs mx-auto">
          <div className="space-y-2">
            <label className="block text-center font-medium text-default-700">
              {label}
            </label>
            <DatePicker
              disableAnimation={true}
              classNames={{
                base: 'w-full',
                input: errors.date ? 'border-danger' : '',
              }}
              isInvalid={!!errors.date}
              errorMessage={errors.date?.message?.toString()}
              label={label}
              value={field.value}
              onChange={(date) => {
                if (isDateValid(date as CalendarDate)) {
                  const calendarDate = date as CalendarDate;
                  field.onChange(calendarDate);
                  console.log(
                    'ISO date for backend:',
                    convertToISOString(calendarDate)
                  );
                } else {
                  const selectedDate = new Date(
                    (date as CalendarDate).toString()
                  );
                  if (selectedDate > today) {
                    toast.error(futureDateError);
                  } else {
                    toast.error(pastDateError);
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    />
  );
};

export default DateField;
