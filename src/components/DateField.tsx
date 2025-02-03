'use client';

import { DatePicker } from '@heroui/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { DateFieldProps } from '@/types/shared-types';

const DateField: React.FC<DateFieldProps> = ({ name, label }) => {
  const { control, getValues } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) => {
          const startDate =
            name === 'startDate' ? value : getValues('startDate');
          const endDate = name === 'endDate' ? value : getValues('endDate');

          if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
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
