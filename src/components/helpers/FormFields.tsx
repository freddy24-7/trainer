import React from 'react';

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { InputFieldProps } from '@/types/shared-types';

export const InputField: React.FC<InputFieldProps> = ({
  name,
  control,
  placeholder,
  errors,
  onKeyDown,
}) => (
  <FormItem>
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <FormControl>
            <input
              {...field}
              placeholder={placeholder}
              className="w-full p-2 border rounded mt-1 bg-white text-black"
              onKeyDown={onKeyDown}
            />
          </FormControl>
          <FormMessage>{errors[name]?.message}</FormMessage>{' '}
        </>
      )}
    />
  </FormItem>
);
