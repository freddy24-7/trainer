import React from 'react';
import {
  FormProvider,
  UseFormReturn,
  UseFormSetValue,
  FieldErrors,
} from 'react-hook-form';

import ListPlayersInTeam from '@/app/matches/ListPlayersInTeam';
import DateField from '@/components/helpers/DateField';
import OpponentField from '@/components/helpers/OpponentField';
import PouleField from '@/components/helpers/PouleField';
import { Button } from '@/components/ui/button';
import { Poule, PouleOpponent } from '@/types/poule-types';
import { Player, FormValues } from '@/types/user-types';
import {
  getPlayerMinutes,
  getPlayerAvailability,
  updatePlayerMinutes,
  updatePlayerAvailability,
} from '@/utils/playerUtils';

interface MatchFormProps {
  methods: UseFormReturn<FormValues>;
  poules: Poule[];
  players: Player[];
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  playerValues: FormValues['players'];
  errors: FieldErrors<FormValues>;
  onSubmit: (data: FormValues) => Promise<void>;
  setValue: UseFormSetValue<FormValues>;
}

const MatchForm: React.FC<MatchFormProps> = ({
  methods,
  poules,
  players,
  selectedPoule,
  selectedOpponent,
  playerValues,
  errors,
  onSubmit,
  setValue,
}) => {
  const { handleSubmit } = methods;

  return (
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
            playerMinutes={
              getPlayerMinutes(playerValues) as { [key: number]: number }
            }
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
                updatePlayerAvailability(playerValues, playerId, available)
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
  );
};

export default MatchForm;
