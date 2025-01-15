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
  const extractOpponentData = (): {
    pouleOpponentId: number | null;
    opponentName: string | null;
  } => {
    const pouleOpponentIdValue = getStringValue(params.get('pouleOpponentId'));
    const pouleOpponentId = pouleOpponentIdValue
      ? parseInt(pouleOpponentIdValue, 10)
      : null;
    const opponentNameValue = getStringValue(params.get('opponentName'));
    const opponentName =
      pouleOpponentId === null &&
      opponentNameValue &&
      opponentNameValue.trim() !== ''
        ? opponentNameValue.trim()
        : null;
    return { pouleOpponentId, opponentName };
  };

  const extractMatchData = (): Omit<MatchFormData, 'players'> => {
    const trainingMatch =
      getStringValue(params.get('matchType')) === 'practice';
    const date = getStringValue(params.get('date'));
    const opponentStrengthValue = getStringValue(
      params.get('opponentStrength')
    );
    const opponentStrength =
      opponentStrengthValue === 'null' ||
      opponentStrengthValue === null ||
      opponentStrengthValue === ''
        ? null
        : (opponentStrengthValue as 'STRONGER' | 'SIMILAR' | 'WEAKER');

    const { pouleOpponentId, opponentName } = extractOpponentData();

    return {
      trainingMatch,
      date,
      opponentStrength,
      pouleOpponentId,
      opponentName,
    };
  };

  const matchData = extractMatchData();

  const players = getParsedJSON(getStringValue(params.get('players')), []);

  const parsedInput: MatchFormData = {
    ...matchData,
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
