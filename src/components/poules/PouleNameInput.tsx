import React from 'react';

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { PouleNameInputProps } from '@/types/types';

function PouleNameInput({
  control,
  errors,
}: PouleNameInputProps): React.ReactElement {
  return (
    <FormItem>
      <FormField
        name="pouleName"
        control={control}
        render={({ field }) => (
          <>
            <FormControl>
              <input
                {...field}
                className="w-full p-2 border rounded mt-1 bg-white text-black"
                placeholder="Poule Name"
              />
            </FormControl>
            <FormMessage>{errors.pouleName?.message}</FormMessage>
          </>
        )}
      />
    </FormItem>
  );
}

export default PouleNameInput;
