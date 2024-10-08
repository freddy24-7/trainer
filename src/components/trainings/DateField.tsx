import React from 'react';
import { useFormContext } from 'react-hook-form';

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { TrainingFormValues } from '@/types/types';

import DateSelector from '../DateSelector';

const DateField: React.FC = (): React.ReactElement => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TrainingFormValues>();

  return (
    <FormItem>
      <FormField
        name="date"
        control={control}
        render={({ field }) => (
          <>
            <FormControl>
              <div className="flex justify-center">
                <DateSelector
                  matchDate={field.value}
                  onDateChange={field.onChange}
                />
              </div>
            </FormControl>
            {errors.date?.message && (
              <FormMessage>{errors.date.message}</FormMessage>
            )}
          </>
        )}
      />
    </FormItem>
  );
};

export default DateField;
