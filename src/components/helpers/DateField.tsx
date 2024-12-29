'use client';

import { DatePicker, CalendarDate } from '@nextui-org/react';
import { toDate } from 'date-fns-tz';
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

  const dateTimeRegex =
    /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9](:([0-5][0-9]|60))?(\.[0-9]{1,9})?)?)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)?)?)?$/;

  function handleParseDateString(dateString) {
    if (dateTimeRegex.test(dateString)) {
      return toDate(dateString);
    }
    return new Date(dateString);
  }

  const isDateValid = (date: CalendarDate): boolean => {
    const selectedDate = handleParseDateString(date.toString());
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
