import { useMemo } from 'react';

import { DisableButtonOptions, DisableButtonResult } from '@/types/ui-types';

const useDisableSubmitButton = ({
  isSubmitting,
  isFutureDate = false,
  isFormValid,
}: DisableButtonOptions): DisableButtonResult => {
  const isButtonDisabled = useMemo(() => {
    return !isFormValid || isSubmitting || isFutureDate;
  }, [isFormValid, isSubmitting, isFutureDate]);

  const buttonClassName = useMemo(
    () =>
      `mt-4 w-full p-2 rounded ${
        isButtonDisabled
          ? 'bg-red-200 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 border border-black'
      }`,
    [isButtonDisabled]
  );

  return { isButtonDisabled, buttonClassName };
};

export default useDisableSubmitButton;
