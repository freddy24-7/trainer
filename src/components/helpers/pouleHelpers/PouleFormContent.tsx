import { Button } from '@heroui/react';
import React, { useState } from 'react';

import { OpponentsList } from '@/components/helpers/pouleHelpers/OpponentsList';
import { PouleFormFields } from '@/components/helpers/pouleHelpers/PouleFormFields';
import {
  pouleManagementHeading,
  addOpponentButtonText,
  addPouleButtonText,
} from '@/strings/clientStrings';
import { PouleFormContentProps, PouleFormValues } from '@/types/poule-types';

const PouleFormContent: React.FC<PouleFormContentProps> = ({
  handleSubmit,
  onSubmit,
  control,
  errors,
  handleAddOpponent,
  opponents,
  handleRemoveOpponent,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: PouleFormValues): Promise<void> => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
        disabled={isSubmitting}
        className={`mt-4 w-full p-2 rounded ${
          isSubmitting
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isSubmitting ? 'Submitting...' : addPouleButtonText}
      </Button>
    </form>
  );
};

export { PouleFormContent };
