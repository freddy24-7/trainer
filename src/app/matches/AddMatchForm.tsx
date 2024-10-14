'use client';

import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { Button } from '@/components/ui/button';
import { Poule, Player, FormValues } from '@/types/type-list';
import { ZodIssue } from 'zod';
import { usePouleState } from '@/hooks/usePouleState';
import { submitMatchForm } from '@/utils/matchFormUtils';
import {
  validateAllPlayers,
  updatePlayerMinutes,
  updatePlayerAvailability,
  getPlayerMinutes,
  getPlayerAvailability,
} from '@/utils/playerUtils';
import { useMatchFormConfig } from '@/hooks/useMatchFormConfig';
import PouleField from '@/components/helpers/PouleField';
import OpponentField from '@/components/helpers/OpponentField';
import DateField from '@/components/helpers/DateField';
import ListPlayersInTeam from '@/app/matches/ListPlayersInTeam';

type Props = {
  poules: Poule[];
  players: Player[];
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
};

function AddMatchForm({ action, poules, players }: Props) {
  const [_, setSubmitting] = useState(false);
  const router = useRouter();

  const methods = useMatchFormConfig(poules, players);
  const {
    handleSubmit,
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

  const validatePlayers = () => {
    return validateAllPlayers(playerValues, selectedPouleId);
  };

  const onSubmit = async (data: FormValues) => {
    await submitMatchForm(data, validatePlayers, setSubmitting, action, router);
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
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <PouleField
                poules={poules}
                selectedPoule={selectedPoule}
                errors={errors}
                onChange={(pouleId) => setValue('poule', pouleId)}
              />
              <OpponentField
                selectedPoule={selectedPoule}
                selectedOpponent={selectedOpponent}
                errors={errors}
                onChange={(opponentId) => setValue('opponent', opponentId)}
              />
              <DateField
                errors={errors}
                onChange={(date) => setValue('date', date)}
              />

              {players.length > 0 && (
                <ListPlayersInTeam
                  players={players}
                  playerMinutes={getPlayerMinutes(playerValues)}
                  playerAvailability={getPlayerAvailability(playerValues)}
                  onMinutesChange={(playerId, minutes) =>
                    setValue(
                      'players',
                      updatePlayerMinutes(playerValues, playerId, minutes)
                    )
                  }
                  onAvailabilityChange={(playerId, available) =>
                    setValue(
                      'players',
                      updatePlayerAvailability(
                        playerValues,
                        playerId,
                        available
                      )
                    )
                  }
                />
              )}

              <Button
                type="submit"
                className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Add Match
              </Button>
            </form>
          </FormProvider>
        </CardBody>
      </Card>
    </div>
  );
}

export { AddMatchForm };
