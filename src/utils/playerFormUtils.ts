import { toast } from 'react-toastify';

import {
  invalidWhatsappNumberMessage,
  invalidInputMessage,
  operationSuccessMessage,
} from '@/strings/serverStrings';
import { HandlePlayerFormSubmitParams } from '@/types/user-types';
import { formatError } from '@/utils/errorUtils';
import { handleFormatWhatsappNumber } from '@/utils/phoneNumberUtils';

export async function handlePlayerFormSubmit({
  data,
  setIsSubmitting,
  validationFunction,
  actionFunction,
  onSuccess,
}: HandlePlayerFormSubmitParams): Promise<void> {
  setIsSubmitting(true);

  const formattedNumber = handleFormatWhatsappNumber(data.whatsappNumber);
  if (!formattedNumber) {
    const error = formatError(invalidWhatsappNumberMessage);
    toast.error(error.errors[0].message);
    setIsSubmitting(false);
    return;
  }

  const formData = new FormData();
  formData.append('username', data.username);
  formData.append('password', data.password);
  formData.append('whatsappNumber', formattedNumber);

  const validation = validationFunction(formData);

  if (!validation.success) {
    const error = formatError(
      validation.errors?.map((err) => err.message).join(', ') ||
        invalidInputMessage
    );
    toast.error(error.errors[0].message);
    setIsSubmitting(false);
    return;
  }

  try {
    const response = await actionFunction(formData);
    if (response.errors.length === 0) {
      onSuccess({ ...data, whatsappNumber: formattedNumber });
      toast.success(operationSuccessMessage);
    } else {
      const error = formatError(
        response.errors.map((error) => error.message).join(', ')
      );
      toast.error(error.errors[0].message);
    }
  } finally {
    setIsSubmitting(false);
  }
}
