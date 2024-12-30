'use client';

import { DatePicker, CalendarDate } from '@nextui-org/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  dateLabel,
  selectDateLabel,
  futureDateError,
  pastDateError,
} from '@/strings/clientStrings';
import { DateProps } from '@/types/shared-types';

const DateField = ({ errors, onChange }: DateProps): React.ReactElement => {
  const { control } = useFormContext();
  const today = new Date();
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(today.getMonth() - 2);

  const isDateValid = (date: CalendarDate): boolean => {
    const selectedDate = new Date(date.toString());
    return selectedDate <= today && selectedDate >= twoMonthsAgo;
  };

  return (
    <Controller
      name="date"
      control={control}
      render={({ field }) => (
        <div className="w-full max-w-xs mx-auto">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-default-700">
              {dateLabel}
            </label>
            <DatePicker
              disableAnimation={true}
              classNames={{
                base: 'w-full',
                input: errors.date ? 'border-danger' : '',
              }}
              isInvalid={!!errors.date}
              errorMessage={errors.date?.message?.toString()}
              label={selectDateLabel}
              value={field.value}
              onChange={(date) => {
                if (isDateValid(date as CalendarDate)) {
                  field.onChange(date);
                  onChange(date as CalendarDate);
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
