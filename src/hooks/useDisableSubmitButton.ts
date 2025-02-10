import { useMemo } from 'react';

interface DisableButtonOptions {
  isSubmitting: boolean;
  isFutureDate?: boolean;
  isFormValid: boolean;
}

const useDisableSubmitButton = ({
  isSubmitting,
  isFutureDate = false,
  isFormValid,
}: DisableButtonOptions): boolean => {
  return useMemo(() => {
    return !isFormValid || isSubmitting || isFutureDate;
  }, [isFormValid, isSubmitting, isFutureDate]);
};

export default useDisableSubmitButton;
