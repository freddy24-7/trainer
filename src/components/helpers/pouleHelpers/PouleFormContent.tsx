import React, { useState } from 'react';

import CustomButton from '@/components/Button';
import { OpponentsList } from '@/components/helpers/pouleHelpers/OpponentsList';
import { PouleFormFields } from '@/components/helpers/pouleHelpers/PouleFormFields';
import useDisableSubmitButton from '@/hooks/useDisableSubmitButton';
import {
  addOpponentButtonText,
  addPouleButtonText,
  submittingText,
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

  const isFormValid = opponents.length > 0;

  const { buttonClassName, isButtonDisabled } = useDisableSubmitButton({
    isSubmitting,
    isFormValid,
  });

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <PouleFormFields
        control={control}
        errors={errors}
        handleAddOpponent={handleAddOpponent}
      />

      <CustomButton type="button" onPress={handleAddOpponent}>
        {addOpponentButtonText}
      </CustomButton>

      {opponents.length > 0 && (
        <OpponentsList opponents={opponents} onRemove={handleRemoveOpponent} />
      )}

      <CustomButton
        type="submit"
        className={buttonClassName}
        style={{
          color: isButtonDisabled ? '#EF4444' : '#22C55E',
        }}
      >
        {isSubmitting ? submittingText : addPouleButtonText}
      </CustomButton>
    </form>
  );
};

export { PouleFormContent };
