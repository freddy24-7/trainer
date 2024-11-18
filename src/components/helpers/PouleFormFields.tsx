import React from 'react';

import { InputField } from '@/components/helpers/FormFields';
import { PouleFormFieldsProps } from '@/types/poule-types';

export function PouleFormFields({
  control,
  errors,
  handleAddOpponent,
}: PouleFormFieldsProps): React.ReactElement {
  return (
    <>
      <InputField
        name="pouleName"
        control={control}
        placeholder="Poule Name"
        errors={errors}
      />
      <InputField
        name="mainTeamName"
        control={control}
        placeholder="Main Team Name"
        errors={errors}
      />
      <InputField
        name="opponentName"
        control={control}
        placeholder="Enter opponent name"
        errors={errors}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAddOpponent();
          }
        }}
      />
    </>
  );
}
