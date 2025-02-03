'use client';

import { DatePicker } from '@heroui/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { DateFieldProps } from '@/types/shared-types';

const DateField: React.FC<DateFieldProps> = ({ name, label }) => {
  const { control, getValues } = useFormContext();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) => {
          if (!value) return 'Date is required';

          const selectedDate = new Date(value);
          const startDate =
            name === 'startDate'
              ? selectedDate
              : new Date(getValues('startDate'));
          const endDate =
            name === 'endDate' ? selectedDate : new Date(getValues('endDate'));

          if (selectedDate > today) {
            return 'Future dates are not allowed';
          }

          if (startDate && endDate && startDate > endDate) {
            return 'Start date cannot be after end date';
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
