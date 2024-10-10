import { createPlayerSchema } from '@/schemas/createPlayerSchema';
import { ValidatePlayerDataResult } from '@/type-list/types';
import { handleValidateFormData } from '@/utils/handleValidateFormData';

export function handleValidatePlayerData(
  params: FormData
): ValidatePlayerDataResult {
  const result = handleValidateFormData(createPlayerSchema, params);

  return {
    errors: result.errors,
    data: result.data || null,
  };
}
