import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import React, { useState } from 'react';

interface Player {
  id: number;
  username: string;
}

interface GoalAssistModalProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  players: Player[];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  onConfirm: (playerId: number, eventType: 'GOAL' | 'ASSIST') => void;
}

const GoalAssistModal: React.FC<GoalAssistModalProps> = ({
  isOpen,
  onOpenChange,
  players,
  playerStates,
  onConfirm,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [eventType, setEventType] = useState<'GOAL' | 'ASSIST'>('GOAL');

  const playersOnPitch = players.filter(
    (player) => playerStates[player.id] === 'playing'
  );

  const handleConfirm = () => {
    if (selectedPlayer) {
      onConfirm(selectedPlayer, eventType);
      setSelectedPlayer(null);
      setEventType('GOAL');
      onOpenChange(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              Record {eventType === 'GOAL' ? 'Goal' : 'Assist'}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <select
                  value={selectedPlayer || ''}
                  onChange={(e) => setSelectedPlayer(Number(e.target.value))}
                  className="border rounded p-2"
                >
                  <option value="" disabled={true}>
                    Select Player
                  </option>
                  {playersOnPitch.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.username}
                    </option>
                  ))}
                </select>
                <div className="flex gap-4">
                  <Button
                    onPress={() => setEventType('GOAL')}
                    color={eventType === 'GOAL' ? 'primary' : 'default'}
                  >
                    Goal
                  </Button>
                  <Button
                    onPress={() => setEventType('ASSIST')}
                    color={eventType === 'ASSIST' ? 'primary' : 'default'}
                  >
                    Assist
                  </Button>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleConfirm}
                disabled={!selectedPlayer}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default GoalAssistModal;
