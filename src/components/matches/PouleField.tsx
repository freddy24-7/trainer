import React from 'react';

import PouleSelector from '@/components/poules/PouleSelector';
import {
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { PouleFieldProps } from '@/types/types';

const PouleField: React.FC<PouleFieldProps> = ({
  control,
  poules,
  selectedPoule,
  errors,
}) => {
  return (
    <FormItem>
      <FormField
        name="poule"
        control={control}
        render={({ field }) => (
          <>
            <FormControl>
              <PouleSelector
                poules={poules}
                selectedPoule={selectedPoule}
                onPouleChange={(pouleId) => field.onChange(pouleId)}
              />
            </FormControl>
            <FormMessage>{errors.poule?.message}</FormMessage>
          </>
        )}
      />
    </FormItem>
  );
};

export default PouleField;
