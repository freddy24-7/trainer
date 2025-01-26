import { Button } from '@heroui/react';
import React, { useState } from 'react';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';

import OpponentField from '@/components/helpers/matchHelpers/OpponentField';
import PouleField from '@/components/helpers/matchHelpers/PouleField';
import StrengthModal from '@/components/helpers/matchHelpers/StrengthModal';
import { useStrengthModal } from '@/hooks/useStrengthModal';
import { MatchFormValues } from '@/types/match-types';
import { Poule, PouleOpponent } from '@/types/poule-types';

interface OpponentLogicProps {
  matchType: 'competition' | 'practice';
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  poules: Poule[];
  errors: FieldErrors<MatchFormValues>;
  setValue: UseFormSetValue<MatchFormValues>;
  opponentStrength?: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null;
}

const OpponentLogic: React.FC<OpponentLogicProps> = ({
  matchType,
  selectedPoule,
  selectedOpponent,
  poules,
  errors,
  setValue,
  opponentStrength,
}) => {
  const strengthModal = useStrengthModal(opponentStrength || null);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const handleConfirmStrength = (): void => {
    if (strengthModal.selectedStrength) {
      setValue('opponentStrength', strengthModal.selectedStrength);
      setIsButtonVisible(false);
      strengthModal.onConfirmChange(false);
    }
  };

  return (
    <>
      {matchType === 'competition' ? (
        <>
          <PouleField
            poules={poules}
            selectedPoule={selectedPoule}
            errors={{ poule: errors.poule }}
            onChange={(pouleId) => setValue('poule', pouleId)}
          />
          <OpponentField
            selectedPoule={selectedPoule}
            selectedOpponent={selectedOpponent}
            errors={{ opponent: errors.opponent }}
            onChange={(opponentId) => setValue('opponent', opponentId)}
          />
        </>
      ) : (
        <div>
          <label
            htmlFor="opponentName"
            className="block mb-2 text-sm font-medium"
          >
            Opponent Name
          </label>
          <input
            id="opponentName"
            type="text"
            onChange={(e) => setValue('opponentName', e.target.value)}
            className={`w-full p-2 border rounded ${
              errors.opponentName ? 'border-red-500' : ''
            }`}
            placeholder="Enter the opponent's name"
          />
          {errors.opponentName?.message && (
            <p className="text-sm text-red-500 mt-1">
              {errors.opponentName.message}
            </p>
          )}
        </div>
      )}

      {isButtonVisible && (
        <>
          <div className="flex flex-col items-center space-y-4 mt-4">
            <Button
              color="primary"
              onPress={strengthModal.onOpen}
              className="mt-4"
            >
              Insert Opponent Strength
            </Button>
          </div>
          <StrengthModal
            isOpen={strengthModal.isOpen}
            onOpenChange={strengthModal.onOpenChange}
            isConfirmOpen={strengthModal.isConfirmOpen}
            onConfirmOpen={strengthModal.onConfirmOpen}
            onConfirmChange={strengthModal.onConfirmChange}
            selectedStrength={strengthModal.selectedStrength}
            setSelectedStrength={strengthModal.setSelectedStrength}
            handleConfirmStrength={handleConfirmStrength}
          />
        </>
      )}
    </>
  );
};

export default OpponentLogic;
