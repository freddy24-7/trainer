import React from 'react';
import { useFormContext, Control } from 'react-hook-form';

import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { TrainingFormValues, AbsentPlayersListProps } from '@/types/types';

const AbsentPlayersList: React.FC<AbsentPlayersListProps> = ({
  players,
}): React.ReactElement => {
  const { control, watch, setValue } = useFormContext<TrainingFormValues>();
  const playerData = watch('players');

  const toggleAbsence = (index: number): void => {
    setValue(`players.${index}.absent`, !playerData[index].absent);
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-2">Absent Players</h3>
      <div className="space-y-2">
        {playerData.map(
          (player: { userId: number; absent: boolean }, index: number) => (
            <FormItem key={player.userId}>
              <FormField
                name={`players.${index}.absent`}
                control={control as unknown as Control<TrainingFormValues>}
                render={() => (
                  <FormControl>
                    <div className="flex justify-start items-center ml-40 space-x-2">
                      <input
                        type="checkbox"
                        checked={player.absent}
                        onChange={() => toggleAbsence(index)}
                        className="checkbox"
                      />
                      <span>
                        {players.find((p) => p.id === player.userId)
                          ?.username || 'Unknown Player'}
                      </span>
                    </div>
                  </FormControl>
                )}
              />
            </FormItem>
          )
        )}
      </div>
    </>
  );
};

export default AbsentPlayersList;
