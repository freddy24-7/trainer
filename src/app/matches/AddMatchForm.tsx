'use client';

import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';

import MatchForm from '@/components/helpers/matchHelpers/MatchFormFieldHelpers';
import { useMatchFormConfig } from '@/hooks/useMatchFormConfig';
import { usePouleState } from '@/hooks/usePouleState';
import { MatchFormProps, MatchFormValues } from '@/types/match-types';
import { FormValues } from '@/types/user-types';
import { submitMatchForm } from '@/utils/matchFormUtils';
import { validateAllPlayers } from '@/utils/playerUtils';

async function handleAddMatchFormSubmit(
  data: MatchFormValues,
  deps: {
    validatePlayers: () => boolean;
    setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    action: MatchFormProps['action'];
    router: ReturnType<typeof useRouter>;
  }
): Promise<void> {
  const { validatePlayers, setSubmitting, action, router } = deps;

  console.log('Raw Form Data:', data);

  if (!data.date) {
    console.error('Date is missing in the form data.');
    return;
  }

  const transformedData: FormValues = {
    ...data,
    players: data.players.map((player) => ({
      id: player.id,
      minutes: player.minutes || 0,
      available: player.available ?? true,
    })),
    date: new Date(
      data.date.year,
      data.date.month - 1,
      data.date.day
    ).toISOString(),
    matchEvents:
      data.matchEvents?.map((matchEvent) => ({
        playerInId: matchEvent.playerInId,
        playerOutId: matchEvent.playerOutId,
        minute: matchEvent.minute,
        eventType: matchEvent.eventType,
        substitutionReason: matchEvent.substitutionReason || null,
      })) || [],
  };

  console.log('Transformed Form Data:', transformedData);

  const success = await submitMatchForm(transformedData, {
    validatePlayers,
    setSubmitting,
    action,
  });

  if (success) {
    router.push('/');
  }
}

function AddMatchForm({
  action,
  poules,
  players,
}: MatchFormProps): React.ReactElement {
  const [, setSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const methods: UseFormReturn<MatchFormValues> = useMatchFormConfig(
    poules,
    players
  );
  const {
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const matchType = watch('matchType');
  const selectedPouleId = watch('poule');
  const playerValues = watch('players');
  const opponentStrength = watch('opponentStrength');
  const matchEvents = watch('matchEvents');

  const { selectedPoule, selectedOpponent } = usePouleState(
    poules,
    selectedPouleId,
    watch,
    setValue
  );

  const validatePlayers = (): boolean => {
    if (matchType === 'practice' && !watch('opponentName')) {
      return false;
    }
    return validateAllPlayers(playerValues, selectedPouleId);
  };

  const onSubmit = (data: MatchFormValues): Promise<void> => {
    return handleAddMatchFormSubmit(data, {
      validatePlayers,
      setSubmitting,
      action,
      router,
    });
  };

  return (
    <FormProvider {...methods}>
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
              opponentStrength={opponentStrength}
              matchEvents={matchEvents || []}
            />
          </CardBody>
        </Card>
      </div>
    </FormProvider>
  );
}

export { AddMatchForm };
