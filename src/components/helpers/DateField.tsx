import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import DateSelector from '@/components/DateSelector';
import { CalendarDate } from '@nextui-org/react';

type Props = {
  errors: any;
  onChange: (date: CalendarDate | null) => void;
};

const DateField = ({ errors, onChange }: Props) => (
  <FormItem>
    <FormField
      name="date"
      render={({ field }) => (
        <>
          <FormControl>
            <DateSelector
              matchDate={field.value as CalendarDate | null}
              onDateChange={onChange}
            />
          </FormControl>
          <FormMessage>{errors.date?.message}</FormMessage>
        </>
      )}
    />
  </FormItem>
);

export default DateField;
