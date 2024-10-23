'use client';

import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ZodIssue } from 'zod';

import MatchForm from '@/components/helpers/matchFormFieldHelpers';
import { useMatchFormConfig } from '@/hooks/useMatchFormConfig';
import { usePouleState } from '@/hooks/usePouleState';
import { Poule } from '@/types/poule-types';
import { Player, FormValues } from '@/types/user-types';
import { submitMatchForm } from '@/utils/matchFormUtils';
import { validateAllPlayers } from '@/utils/playerUtils';

interface Props {
  poules: Poule[];
  players: Player[];
  action: (
    _prevState: unknown,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
}

function AddMatchForm({ action, poules, players }: Props): React.ReactElement {
  const [, setSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const methods: UseFormReturn<FormValues> = useMatchFormConfig(
    poules,
    players
  );
  const {
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const selectedPouleId = watch('poule');
  const playerValues = watch('players');

  const { selectedPoule, selectedOpponent } = usePouleState(
    poules,
    selectedPouleId,
    setValue
  );

  const validatePlayers = (): boolean => {
    return validateAllPlayers(playerValues, selectedPouleId);
  };

  const onSubmit = async (data: FormValues): Promise<void> => {
    const success = await submitMatchForm(data, {
      validatePlayers,
      setSubmitting,
      action,
    });

    if (success) {
      router.push('/');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold mx-auto text-center">
            Add a New Match
          </h3>
        </CardHeader>
        <CardBody>
          <MatchForm
            methods={methods}
            poules={poules}
            players={players}
            selectedPoule={selectedPoule}
            selectedOpponent={selectedOpponent}
            playerValues={playerValues}
            errors={errors}
            onSubmit={onSubmit}
            setValue={setValue}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export { AddMatchForm };
