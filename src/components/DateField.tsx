'use client';

import { DatePicker } from '@heroui/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface DateFieldProps {
  name: string;
  label: string;
  errors?: Record<string, unknown>;
}

const DateField: React.FC<DateFieldProps> = ({ name, label, errors }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="w-full max-w-xs mx-auto">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-default-700">
              {label}
            </label>
            <DatePicker
              className="w-full"
              label={label}
              value={field.value}
              onChange={(date) => {
                field.onChange(date);
              }}
              classNames={{
                base: 'w-full',
                input: errors && errors[name] ? 'border-danger' : '',
              }}
              isInvalid={!!(errors && errors[name])}
              errorMessage={errors && errors[name]?.toString()}
            />
          </div>
        </div>
      )}
    />
  );
};

export default DateField;
