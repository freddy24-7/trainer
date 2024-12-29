'use client';

import { DatePicker, CalendarDate } from '@nextui-org/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  matchDateLabel,
  selectMatchDateLabel,
  futureDateError,
} from '@/strings/clientStrings';
import { DateProps } from '@/types/shared-types';

const DateField = ({ errors, onChange }: DateProps): React.ReactElement => {
  const { control } = useFormContext();
  const today = new Date();

  const isDateValid = (date: CalendarDate): boolean => {
    const selectedDate = new Date(date.toDate('CET'));
    return selectedDate <= today;
  };

  return (
    <Controller
      name="date"
      control={control}
      render={({ field }) => (
        <div className="w-full max-w-xs mx-auto">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-default-700">
              {matchDateLabel}
            </label>
            <DatePicker
              disableAnimation={true}
              classNames={{
                base: 'w-full',
                input: errors.date ? 'border-danger' : '',
              }}
              isInvalid={!!errors.date}
              errorMessage={errors.date?.message?.toString()}
              label={selectMatchDateLabel}
              value={field.value}
              onChange={(date) => {
                if (isDateValid(date as CalendarDate)) {
                  field.onChange(date);
                  onChange(date as CalendarDate);
                } else {
                  toast.error(futureDateError);
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
