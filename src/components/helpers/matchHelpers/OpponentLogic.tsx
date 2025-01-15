import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import React, { useState } from 'react';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';

import OpponentField from '@/components/helpers/OpponentField';
import PouleField from '@/components/helpers/PouleField';
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

  const handleConfirmStrength = () => {
    if (selectedStrength) {
      setValue('opponentStrength', selectedStrength);
      setIsButtonVisible(false);
      onConfirmChange();
    }
  };

  return (
    <>
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

      {matchType === 'competition' && (
        <PouleField
          poules={poules}
          selectedPoule={selectedPoule}
          errors={{ poule: errors.poule }}
          onChange={(pouleId) => setValue('poule', pouleId)}
        />
      )}

      {isButtonVisible && (
        <>
          <Button color="primary" onPress={onOpen} className="mt-4">
            Insert Opponent Strength
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>Select Opponent Strength</ModalHeader>
                  <ModalBody>
                    <div className="flex flex-col gap-4">
                      <Button onPress={() => setSelectedStrength('STRONGER')}>
                        Stronger
                      </Button>
                      <Button onPress={() => setSelectedStrength('SIMILAR')}>
                        Similar
                      </Button>
                      <Button onPress={() => setSelectedStrength('WEAKER')}>
                        Weaker
                      </Button>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onPress={() => {
                        onClose();
                        if (selectedStrength) {
                          onConfirmOpen();
                        }
                      }}
                    >
                      Confirm
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <Modal isOpen={isConfirmOpen} onOpenChange={onConfirmChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>Confirm Strength Selection</ModalHeader>
                  <ModalBody>
                    Are you sure you want to select &quot;{selectedStrength}
                    &quot; as the opponent&apos;s strength?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onPress={() => {
                        handleConfirmStrength();
                        onClose();
                      }}
                    >
                      Confirm
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default OpponentLogic;
