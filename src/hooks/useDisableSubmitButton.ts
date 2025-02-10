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
          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
          : 'bg-black text-white hover:bg-gray-800'
      }`,
    [isButtonDisabled]
  );

  return { isButtonDisabled, buttonClassName };
};

export default useDisableSubmitButton;
