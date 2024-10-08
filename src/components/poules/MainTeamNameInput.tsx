import React from 'react';

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { MainTeamNameInputProps } from '@/types/types';

function MainTeamNameInput({
  control,
  errors,
}: MainTeamNameInputProps): React.ReactElement {
  return (
    <FormItem>
      <FormField
        name="mainTeamName"
        control={control}
        render={({ field }) => (
          <>
            <FormControl>
              <input
                {...field}
                className="w-full p-2 border rounded mt-1 bg-white text-black"
                placeholder="Main Team Name"
              />
            </FormControl>
            <FormMessage>{errors.mainTeamName?.message}</FormMessage>
          </>
        )}
      />
    </FormItem>
  );
}

export default MainTeamNameInput;
