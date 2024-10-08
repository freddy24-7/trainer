import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { PouleFormValues } from '@/types/types';

interface OpponentInputProps {
  control: Control<PouleFormValues>;
  errors: FieldErrors<PouleFormValues>;
  addOpponent: () => void;
}

function OpponentInput({
  control,
  errors,
  addOpponent,
}: OpponentInputProps): React.ReactElement {
  return (
    <>
      <FormItem>
        <FormField
          name="opponentName"
          control={control}
          render={({ field }) => (
            <>
              <FormControl>
                <input
                  {...field}
                  placeholder="Enter opponent name"
                  className="w-full p-2 border rounded mt-1 bg-white text-black"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addOpponent();
                    }
                  }}
                />
              </FormControl>
              <FormMessage>{errors.opponents?.message}</FormMessage>
            </>
          )}
        />
      </FormItem>
      <Button
        type="button"
        onClick={addOpponent}
        className="mt-2 bg-blue-500 text-white p-1 rounded"
      >
        Add Opponent
      </Button>
    </>
  );
}

export default OpponentInput;
