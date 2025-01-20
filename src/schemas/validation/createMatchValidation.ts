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
    const pouleOpponentId =
      parseInt(getStringValue(params.get('pouleOpponentId')) || '', 10) || null;
    const opponentName = pouleOpponentId
      ? null
      : getStringValue(params.get('opponentName'))?.trim() || null;
    return { pouleOpponentId, opponentName };
  };
  const extractMatchMetadata = (): {
    trainingMatch: boolean;
    date: string | null;
    opponentStrength: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null;
  } => {
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
    return { trainingMatch, date, opponentStrength };
  };
  const extractPlayers = (): {
    id: number;
    minutes: number;
    available: boolean;
  }[] => getParsedJSON(getStringValue(params.get('players')), []);
  const extractEvents = (): {
    playerInId?: number | null;
    playerOutId?: number | null;
    minute: number;
    eventType: 'SUBSTITUTION_IN' | 'SUBSTITUTION_OUT';
    substitutionReason?: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
  }[] => {
    const matchEvents = getParsedJSON(
      getStringValue(params.get('matchEvents')),
      []
    );
    return Array.isArray(matchEvents) ? matchEvents : [];
  };

  const matchData = {
    ...extractMatchMetadata(),
    ...extractOpponentData(),
    players: extractPlayers(),
    matchEvents: extractEvents(),
  };
  console.log('Validation Input:', JSON.stringify(matchData, null, 2));
  const validation = createMatchSchema.safeParse(matchData);
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
