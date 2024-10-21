import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { PouleFormValues } from '@/types/poule-types';

interface InputFieldProps {
  name: keyof PouleFormValues;
  control: Control<PouleFormValues>;
  placeholder: string;
  errors: FieldErrors<PouleFormValues>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

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
