import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import PouleSelector from '@/components/helpers/PouleSelector';
import { Poule } from '@/types/poule-types';

type Props = {
  poules: Poule[];
  selectedPoule: Poule | null;
  errors: any;
  onChange: (pouleId: number) => void;
};

const PouleField = ({ poules, selectedPoule, errors, onChange }: Props) => (
  <FormItem>
    <FormField
      name="poule"
      render={() => (
        <>
          <FormControl>
            <PouleSelector
              poules={poules}
              selectedPoule={selectedPoule}
              onPouleChange={onChange}
            />
          </FormControl>
          <FormMessage>{errors.poule?.message}</FormMessage>
        </>
      )}
    />
  </FormItem>
);

export default PouleField;
