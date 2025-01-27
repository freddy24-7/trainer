import React from 'react';
import { useFormContext } from 'react-hook-form';

import { InputFieldProps } from '@/types/shared-types';

export const InputField: React.FC<InputFieldProps> = ({
  name,
  placeholder,
  errors,
  onKeyDown,
}) => {
  const { register } = useFormContext();

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          {...register(name)}
          placeholder={placeholder}
          className="w-full p-2 border rounded mt-1 bg-white text-black"
          onKeyDown={onKeyDown}
        />
      </div>
      {errors[name]?.message && (
        <span className="text-danger text-sm mt-1">
          {errors[name]?.message}
        </span>
      )}
    </div>
  );
};
