import { Button } from '@heroui/react';
import React from 'react';

import { OpponentsList } from '@/components/helpers/pouleHelpers/OpponentsList';
import { PouleFormFields } from '@/components/helpers/pouleHelpers/PouleFormFields';
import {
  pouleManagementHeading,
  addOpponentButtonText,
  addPouleButtonText,
} from '@/strings/clientStrings';
import { PouleFormContentProps } from '@/types/poule-types';

const PouleFormContent: React.FC<PouleFormContentProps> = ({
  handleSubmit,
  onSubmit,
  control,
  errors,
  handleAddOpponent,
  opponents,
  handleRemoveOpponent,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-semibold">{pouleManagementHeading}</h3>

      <PouleFormFields
        control={control}
        errors={errors}
        handleAddOpponent={handleAddOpponent}
      />

      <Button
        type="button"
        onPress={handleAddOpponent}
        className="mt-2 bg-blue-500 text-white p-1 rounded"
      >
        {addOpponentButtonText}
      </Button>

      {opponents.length > 0 && (
        <OpponentsList opponents={opponents} onRemove={handleRemoveOpponent} />
      )}

      <Button
        type="submit"
        className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800"
      >
        {addPouleButtonText}
      </Button>
    </form>
  );
};

export { PouleFormContent };
