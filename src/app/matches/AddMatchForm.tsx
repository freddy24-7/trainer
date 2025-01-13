'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import MatchForm from '@/components/helpers/MatchFormFieldHelpers';
import { MatchFormProps } from '@/types/match-types';
import { FormValues } from '@/types/user-types';

function AddMatchForm({
  action,
  poules,
  players,
}: MatchFormProps): React.ReactElement {
  const [matchType, setMatchType] = useState<'PRACTICE' | 'COMPETITION' | null>(
    null
  );
  const router = useRouter();

  const methods = useForm<FormValues>();

  const validateFormData = (data: FormValues): string | null => {
    if (!matchType) return 'Match type is required.';
    if (!data.date) return 'Date is required.';
    if (matchType === 'COMPETITION' && !data.poule)
      return 'Poule is required for competition matches.';
    if (
      matchType === 'PRACTICE' &&
      (!data.opponent || typeof data.opponent !== 'string')
    )
      return 'Opponent name is required for practice matches.';
    if (!data.players || data.players.length === 0)
      return 'At least one player must be added.';
    for (const player of data.players) {
      if (!player.id) return 'Each player must have an ID.';
      if (typeof player.minutes !== 'number' || player.minutes < 0)
        return `Invalid minutes played for player with ID ${player.id}.`;
      if (typeof player.available !== 'boolean')
        return `Player availability must be specified for player with ID ${player.id}.`;
    }
    if (data.events) {
      for (const event of data.events) {
        if (typeof event.minute !== 'number' || event.minute < 0)
          return 'Each event must have a valid minute.';
        if (!event.playerId)
          return 'Each event must be associated with a valid player ID.';
        if (!event.substitutionReason)
          return 'Each substitution event must have a valid reason.';
      }
    }
    return null;
  };

  const onSubmit = async (data: FormValues): Promise<void> => {
    // Validate data before preparing FormData
    const validationError = validateFormData(data);
    if (validationError) {
      console.error('Validation Error:', validationError);
      toast.error(validationError);
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('matchType', matchType || '');
    formData.append('date', data.date ? data.date.toString() : '');
    formData.append('poule', data.poule?.toString() || '');
    formData.append('opponent', data.opponent?.toString() || '');
    formData.append('players', JSON.stringify(data.players));
    if (data.events) {
      formData.append('events', JSON.stringify(data.events));
    }

    // Log FormData entries
    console.log('FormData being sent to the backend:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const result = await action(null, formData);

      if (result.errors?.length) {
        console.error('Submission Errors:', result.errors);
        toast.error('Submission failed. Please check the data and try again.');
      } else {
        toast.success('Match successfully submitted!');
        router.push('/');
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  if (!matchType) {
    return (
      <div className="w-full max-w-md mx-auto mt-10">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setMatchType('PRACTICE')}
            className="p-4 bg-blue-500 text-white rounded"
          >
            Practice Match
          </button>
          <button
            onClick={() => setMatchType('COMPETITION')}
            className="p-4 bg-green-500 text-white rounded"
          >
            Competition Match
          </button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-md mx-auto mt-10">
        <MatchForm
          methods={methods}
          poules={poules}
          players={players}
          selectedPoule={null}
          selectedOpponent={null}
          playerValues={[]}
          errors={{}}
          onSubmit={onSubmit}
          setValue={methods.setValue}
          matchType={matchType}
        />
      </div>
    </FormProvider>
  );
}

export default AddMatchForm;
