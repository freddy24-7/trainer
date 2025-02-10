'use client';

import { DatePicker } from '@heroui/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  dateRequiredError,
  startDateAfterEndDateError,
} from '@/strings/clientStrings';
import { DateFieldProps } from '@/types/shared-types';

const DateField: React.FC<DateFieldProps> = ({ name, label }) => {
  const { control, getValues } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) => {
          if (!value) return dateRequiredError;

          const selectedDate = new Date(value);
          const startDate =
            name === 'startDate'
              ? selectedDate
              : new Date(getValues('startDate'));
          const endDate =
            name === 'endDate' ? selectedDate : new Date(getValues('endDate'));

          if (startDate && endDate && startDate > endDate) {
            return startDateAfterEndDateError;
          }

          return true;
        },
      }}
      render={({ field, fieldState }) => (
        <div className="w-full max-w-xs mx-auto">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-default-700">
              {label}
            </label>
            <DatePicker
              className="w-full"
              label={label}
              value={field.value}
              onChange={(date) => field.onChange(date)}
              classNames={{
                base: 'w-full',
                input: fieldState.error ? 'border-danger' : '',
              }}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
            />
            {fieldState.error && (
              <p className="text-red-500 text-sm">{fieldState.error.message}</p>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default DateField;
