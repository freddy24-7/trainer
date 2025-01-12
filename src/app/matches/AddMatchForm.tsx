'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

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

  const onSubmit = async (data: FormValues): Promise<void> => {
    if (!matchType) {
      console.error('Match type is not set.');
      return;
    }

    const formData = new FormData();

    formData.append('matchType', matchType);
    formData.append('date', data.date ? data.date.toString() : '');
    formData.append('poule', data.poule?.toString() || '');
    formData.append('opponent', data.opponent?.toString() || '');
    formData.append('players', JSON.stringify(data.players));
    if (data.events) {
      formData.append('events', JSON.stringify(data.events));
    }

    const success = await action(null, formData);

    if (success?.errors?.length) {
      console.error('Submission failed:', success.errors);
    } else {
      router.push('/');
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
