import { Button, useDisclosure } from '@nextui-org/react';
import React, { useState } from 'react';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';

import OpponentField from '@/components/helpers/matchHelpers/OpponentField';
import PouleField from '@/components/helpers/matchHelpers/PouleField';
import StrengthModal from '@/components/helpers/matchHelpers/StrengthModal';
import { MatchFormValues } from '@/types/match-types';
import { Poule, PouleOpponent } from '@/types/poule-types';

const handleConfirmStrength = (
  selectedStrength: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null,
  setValue: UseFormSetValue<MatchFormValues>,
  setIsButtonVisible: React.Dispatch<React.SetStateAction<boolean>>,
  onConfirmChange: () => void
): void => {
  if (selectedStrength) {
    setValue('opponentStrength', selectedStrength);
    setIsButtonVisible(false);
    onConfirmChange();
  }
};

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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmChange,
  } = useDisclosure();
  const [selectedStrength, setSelectedStrength] = useState<
    'STRONGER' | 'SIMILAR' | 'WEAKER' | null
  >(opponentStrength || null);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  return (
    <>
      {matchType === 'competition' && (
        <PouleField
          poules={poules}
          selectedPoule={selectedPoule}
          errors={{ poule: errors.poule }}
          onChange={(pouleId) => setValue('poule', pouleId)}
        />
      )}
      {matchType === 'competition' ? (
        <div>
          <OpponentField
            selectedPoule={selectedPoule}
            selectedOpponent={selectedOpponent}
            errors={{ opponent: errors.opponent }}
            onChange={(opponentId) => setValue('opponent', opponentId)}
          />
        </div>
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
          <Button color="primary" onPress={onOpen} className="mt-4">
            Insert Opponent Strength
          </Button>
          <StrengthModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isConfirmOpen={isConfirmOpen}
            onConfirmOpen={onConfirmOpen}
            onConfirmChange={onConfirmChange}
            selectedStrength={selectedStrength}
            setSelectedStrength={setSelectedStrength}
            handleConfirmStrength={() =>
              handleConfirmStrength(
                selectedStrength,
                setValue,
                setIsButtonVisible,
                onConfirmChange
              )
            }
          />
        </>
      )}
    </>
  );
};

export default OpponentLogic;
