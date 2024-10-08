import React from 'react';
import { useFormContext } from 'react-hook-form';

import { FormValues, MatchDetailsFieldsProps } from '@/types/types';

import OpponentField from './OpponentField';
import PouleField from './PouleField';
import DateField from '../DateField';

const MatchDetailsFields: React.FC<MatchDetailsFieldsProps> = ({
  poules,
  selectedPoule,
  selectedOpponent,
  errors,
}) => {
  const { control } = useFormContext<FormValues>();

  return (
    <>
      <PouleField
        control={control}
        poules={poules}
        selectedPoule={selectedPoule}
        errors={errors}
      />

      {selectedPoule && selectedPoule.opponents.length > 0 && (
        <OpponentField
          control={control}
          opponents={selectedPoule.opponents}
          selectedOpponent={selectedOpponent}
          errors={errors}
        />
      )}

      <DateField control={control} errors={errors} />
    </>
  );
};

export default MatchDetailsFields;
