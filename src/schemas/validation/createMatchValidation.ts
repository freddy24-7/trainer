import { ZodIssue } from 'zod';

import { createMatchSchema } from '@/schemas/matchSchema';
import { MatchFormData } from '@/types/validation-types';

export function handleValidateMatchData(params: FormData): {
  success: boolean;
  data?: MatchFormData;
  errors?: ZodIssue[];
} {
  const getStringValue = (value: FormDataEntryValue | null): string | null =>
    typeof value === 'string' ? value : null;

  const getParsedJSON = <T>(value: string | null, defaultValue: T): T => {
    try {
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error(`Failed to parse JSON for value: ${value}`, error);
      return defaultValue;
    }
  };

  console.log('pouleOpponentId raw:', params.get('pouleOpponentId'));
  console.log(
    'pouleOpponentId parsed:',
    parseInt(getStringValue(params.get('pouleOpponentId')) ?? '', 10)
  );

  const trainingMatch = getStringValue(params.get('matchType')) === 'practice';

  const pouleOpponentIdValue = getStringValue(params.get('pouleOpponentId'));
  const pouleOpponentId = pouleOpponentIdValue
    ? parseInt(pouleOpponentIdValue, 10)
    : null;

  const opponentNameValue = getStringValue(params.get('opponentName'));
  const opponentName =
    pouleOpponentId === null
      ? opponentNameValue && opponentNameValue.trim() !== ''
        ? opponentNameValue.trim()
        : null
      : null;

  const date = getStringValue(params.get('date'));

  const players = getParsedJSON(getStringValue(params.get('players')), []);

  const parsedInput: MatchFormData = {
    trainingMatch,
    pouleOpponentId,
    opponentName,
    date,
    players,
  };

  console.log('Validation Input:', JSON.stringify(parsedInput, null, 2));

  const validation = createMatchSchema.safeParse(parsedInput);

  if (!validation.success) {
    console.error(
      'Validation Issues:',
      JSON.stringify(validation.error.issues, null, 2)
    );
    return {
      success: false,
      errors: validation.error.issues,
    };
  }

  console.log('Validation Passed:', JSON.stringify(validation.data, null, 2));

  return {
    success: true,
    data: validation.data as MatchFormData,
  };
}
