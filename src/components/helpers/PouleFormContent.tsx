import React from 'react';
import { Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

import { OpponentsList } from '@/components/helpers/OpponentsList';
import { PouleFormFields } from '@/components/helpers/PouleFormFields';
import { Button } from '@/components/ui/button';
import { PouleFormValues } from '@/types/poule-types';

interface PouleFormContentProps {
  handleSubmit: UseFormHandleSubmit<PouleFormValues>;
  onSubmit: (data: PouleFormValues) => Promise<void>;
  control: Control<PouleFormValues>;
  errors: FieldErrors<PouleFormValues>;
  handleAddOpponent: () => void;
  opponents: string[];
  handleRemoveOpponent: (index: number) => void;
}

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
      <h3 className="text-lg font-semibold">Poule Management</h3>

      <PouleFormFields
        control={control}
        errors={errors}
        handleAddOpponent={handleAddOpponent}
      />

      <Button
        type="button"
        onClick={handleAddOpponent}
        className="mt-2 bg-blue-500 text-white p-1 rounded"
      >
        Add Opponent
      </Button>

      {opponents.length > 0 && (
        <OpponentsList opponents={opponents} onRemove={handleRemoveOpponent} />
      )}

      <Button
        type="submit"
        className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Add Poule
      </Button>
    </form>
  );
};

export { PouleFormContent };
