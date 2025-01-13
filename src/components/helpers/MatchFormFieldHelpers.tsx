'use client';

import {
  CalendarDate,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import React, { useState } from 'react';
import { SubmitHandler, FormProvider } from 'react-hook-form';
import { toast } from 'react-toastify';

import DateField from '@/components/helpers/DateField';
import OpponentField from '@/components/helpers/OpponentField';
import PouleField from '@/components/helpers/PouleField';
import { MatchFormFieldProps } from '@/types/match-types';
import { FormValues } from '@/types/user-types';

const MatchForm: React.FC<MatchFormFieldProps> = ({
  methods,
  players,
  errors,
  onSubmit,
  poules,
  selectedPoule,
  selectedOpponent,
  matchType,
  setValue,
}) => {
  const { handleSubmit } = methods;

  const [playerStates, setPlayerStates] = useState<
    Record<number, 'playing' | 'bench' | 'absent'>
  >(players.reduce((acc, player) => ({ ...acc, [player.id]: 'absent' }), {}));
  const [matchDate, setMatchDate] = useState<CalendarDate | null>(null);
  const [matchDuration, setMatchDuration] = useState(70);
  const [goals, setGoals] = useState<
    { scorerId: number; assisterId?: number }[]
  >([]);
  const [substitutions, setSubstitutions] = useState<
    { minute: number; playerInId: number; playerOutId: number }[]
  >([]);
  const [startingTeamDefined, setStartingTeamDefined] = useState(false);

  const {
    isOpen: isGoalModalOpen,
    onOpen: onGoalModalOpen,
    onOpenChange: onGoalModalClose,
  } = useDisclosure();
  const {
    isOpen: isSubstitutionModalOpen,
    onOpen: onSubstitutionModalOpen,
    onOpenChange: onSubstitutionModalClose,
  } = useDisclosure();
  const {
    isOpen: isStartingPlayersModalOpen,
    onOpen: onStartingPlayersModalOpen,
    onOpenChange: onStartingPlayersModalClose,
  } = useDisclosure();
  const {
    isOpen: isConfirmStartingTeamModalOpen,
    onOpen: onConfirmStartingTeamModalOpen,
    onOpenChange: onConfirmStartingTeamModalClose,
  } = useDisclosure();

  const [scorerId, setScorerId] = useState<number | null>(null);
  const [assisterId, setAssisterId] = useState<number | null>(null);
  const [minute, setMinute] = useState('');
  const [playerOutId, setPlayerOutId] = useState<number | null>(null);
  const [playerInId, setPlayerInId] = useState<number | null>(null);
  const [substitutionReason, setSubstitutionReason] = useState<
    'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null
  >(null);
  const [opponentName, setOpponentName] = useState<string>('');

  const playingPlayers = players.filter(
    (player) => playerStates[player.id] === 'playing'
  );
  const benchPlayers = players.filter(
    (player) => playerStates[player.id] === 'bench'
  );

  const handlePlayerStateChange = (
    playerId: number,
    newState: 'playing' | 'bench' | 'absent'
  ) => {
    setPlayerStates((prev) => ({
      ...prev,
      [playerId]: newState,
    }));
  };

  const handleDateChange = (date: CalendarDate | null) => {
    if (date) {
      setMatchDate(date);
    } else {
      toast.error('Invalid date selected.');
    }
  };

  const handleConfirmGoal = () => {
    if (scorerId === null) {
      toast.error('Please select a goal scorer.');
      return;
    }

    setGoals((prev) => [
      ...prev,
      { scorerId, assisterId: assisterId ?? undefined },
    ]);

    onGoalModalClose();
    setScorerId(null);
    setAssisterId(null);
  };

  const handleConfirmSubstitution = () => {
    if (!minute || !playerOutId || !playerInId || !substitutionReason) {
      toast.error('Please fill all fields for substitution.');
      return;
    }

    setSubstitutions((prev) => [
      ...prev,
      { minute: parseInt(minute, 10), playerInId, playerOutId },
    ]);

    setPlayerStates((prev) => ({
      ...prev,
      [playerOutId]: 'bench',
      [playerInId]: 'playing',
    }));

    onSubstitutionModalClose();
    setMinute('');
    setPlayerOutId(null);
    setPlayerInId(null);
    setSubstitutionReason(null);

    toast.success('Substitution recorded!');
  };

  const handleConfirmStartingTeam = () => {
    onStartingPlayersModalClose();
    onConfirmStartingTeamModalOpen();
  };

  const finalizeStartingTeam = () => {
    setStartingTeamDefined(true);
    onConfirmStartingTeamModalClose();
    toast.success('Starting team finalized!');
  };

  const calculateMinutesPlayed = () => {
    const playerMinutes: Record<number, number> = {};
    const events: { minute: number; type: 'in' | 'out'; playerId: number }[] =
      [];

    substitutions.forEach((sub) => {
      events.push({
        minute: sub.minute,
        type: 'out',
        playerId: sub.playerOutId,
      });
      events.push({ minute: sub.minute, type: 'in', playerId: sub.playerInId });
    });

    events.sort((a, b) => a.minute - b.minute);

    players.forEach((player) => {
      if (playerStates[player.id] === 'absent') {
        playerMinutes[player.id] = 0;
        return;
      }

      let totalMinutes = 0;
      let lastInMinute = 0;

      if (playerStates[player.id] === 'playing') {
        lastInMinute = 0;
      }

      events.forEach((event) => {
        if (event.playerId === player.id) {
          if (event.type === 'in') lastInMinute = event.minute;
          if (event.type === 'out') {
            totalMinutes += event.minute - lastInMinute;
            lastInMinute = 0;
          }
        }
      });

      if (lastInMinute > 0) {
        totalMinutes += matchDuration - lastInMinute;
      }

      playerMinutes[player.id] = totalMinutes;
    });

    return playerMinutes;
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    const playerMinutes = calculateMinutesPlayed();

    const matchPlayers = players.map((player) => ({
      userId: player.id,
      minutes: playerMinutes[player.id],
      available: playerStates[player.id] !== 'absent',
      status: playerStates[player.id],
    }));

    const absentPlayers = players
      .filter((player) => playerStates[player.id] === 'absent')
      .map((player) => ({
        userId: player.id,
        available: false,
        status: 'absent',
      }));

    const formData = {
      ...data,
      matchDate: matchDate ? new Date(matchDate.toString()) : null,
      matchPlayers,
      goals,
      absentPlayers,
    };

    await onSubmit(formData);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Match Type */}
        <div>
          <h4 className="text-md font-semibold">Match Type</h4>
          <p>{matchType}</p>
        </div>

        {/* Opponent Selection */}
        {matchType === 'COMPETITION' ? (
          <>
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
          </>
        ) : (
          <div>
            <label>
              Insert Opponent:
              <input
                type="text"
                value={opponentName}
                onChange={(e) => setOpponentName(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Enter opponent name"
              />
            </label>
          </div>
        )}

        {/* Date Field */}
        <div>
          <DateField errors={errors} onChange={handleDateChange} />
        </div>

        {/* Match Duration */}
        <div>
          <label>
            Match Duration (minutes):
            <input
              type="number"
              value={matchDuration}
              onChange={(e) => setMatchDuration(parseInt(e.target.value, 10))}
              className="border rounded p-2 w-16 ml-2"
              min={1}
            />
          </label>
        </div>

        {/* Starting Players Section */}
        {!startingTeamDefined && (
          <div>
            <Button
              onPress={onStartingPlayersModalOpen}
              className="bg-blue-500"
            >
              Select Starting Team
            </Button>
          </div>
        )}

        {/* Goal Section */}
        <div>
          <h4 className="text-md font-semibold mt-6 mb-4">Goals</h4>
          <Button onPress={onGoalModalOpen} className="bg-blue-500">
            Add Goal?
          </Button>
          <ul className="mt-4 list-disc list-inside">
            {goals.map((goal, index) => (
              <li key={index}>
                Goal Scorer:{' '}
                {players.find((p) => p.id === goal.scorerId)?.username}
                {goal.assisterId &&
                  `, Assist: ${players.find((p) => p.id === goal.assisterId)?.username}`}
              </li>
            ))}
          </ul>
        </div>

        {/* Substitution Section */}
        <div>
          <Button onPress={onSubstitutionModalOpen} className="bg-green-500">
            Add Substitution?
          </Button>
        </div>

        {/* Modals */}
        {/* Starting Players Modal */}
        <Modal
          isOpen={isStartingPlayersModalOpen}
          onOpenChange={onStartingPlayersModalClose}
        >
          <ModalContent>
            <ModalHeader>Select Starting Team</ModalHeader>
            <ModalBody>
              <h4 className="text-md font-semibold">Select Starting Players</h4>
              {players.map((player) => (
                <div
                  key={player.id}
                  className="grid grid-cols-4 items-center gap-4 mb-1"
                >
                  <p className="col-span-1">{player.username}</p>
                  <label className="flex items-center gap-2 col-span-1">
                    <input
                      type="radio"
                      name={`player-${player.id}`}
                      value="playing"
                      checked={playerStates[player.id] === 'playing'}
                      onChange={() =>
                        handlePlayerStateChange(player.id, 'playing')
                      }
                    />
                    Playing
                  </label>
                  <label className="flex items-center gap-2 col-span-1">
                    <input
                      type="radio"
                      name={`player-${player.id}`}
                      value="bench"
                      checked={playerStates[player.id] === 'bench'}
                      onChange={() =>
                        handlePlayerStateChange(player.id, 'bench')
                      }
                    />
                    Bench
                  </label>
                  <label className="flex items-center gap-2 col-span-1">
                    <input
                      type="radio"
                      name={`player-${player.id}`}
                      value="absent"
                      checked={playerStates[player.id] === 'absent'}
                      onChange={() =>
                        handlePlayerStateChange(player.id, 'absent')
                      }
                    />
                    Absent
                  </label>
                </div>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button onPress={onStartingPlayersModalClose} color="danger">
                Cancel
              </Button>
              <Button onPress={handleConfirmStartingTeam} color="primary">
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Confirm Starting Team Modal */}
        <Modal
          isOpen={isConfirmStartingTeamModalOpen}
          onOpenChange={onConfirmStartingTeamModalClose}
        >
          <ModalContent>
            <ModalHeader>Confirm Starting Team</ModalHeader>
            <ModalBody>
              <p>
                Are you sure this is your starting team? This action cannot be
                undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onConfirmStartingTeamModalClose} color="danger">
                Cancel
              </Button>
              <Button onPress={finalizeStartingTeam} color="primary">
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Goal Modal */}
        <Modal isOpen={isGoalModalOpen} onOpenChange={onGoalModalClose}>
          <ModalContent>
            <ModalHeader>Select Goal Scorer and Assister</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                {/* Column Titles */}
                <div className="text-center font-semibold">Scorer</div>
                <div className="text-center font-semibold">Assister</div>

                {/* Scorer and Assister Options */}
                {playingPlayers.map((player) => (
                  <React.Fragment key={player.id}>
                    {/* Scorer Option */}
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="scorer"
                        value={player.id}
                        checked={scorerId === player.id}
                        onChange={() => setScorerId(player.id)}
                      />
                      {player.username}
                    </label>
                    <label className="flex items-center gap-2">
                      {scorerId !== player.id && (
                        <>
                          <input
                            type="radio"
                            name="assister"
                            value={player.id}
                            checked={assisterId === player.id}
                            onChange={() => setAssisterId(player.id)}
                          />
                          {player.username}
                        </>
                      )}
                    </label>
                  </React.Fragment>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onGoalModalClose} color="danger">
                Cancel
              </Button>
              <Button onPress={handleConfirmGoal} color="primary">
                Confirm Goal
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Substitution Modal */}
        <Modal
          isOpen={isSubstitutionModalOpen}
          onOpenChange={onSubstitutionModalClose}
        >
          <ModalContent>
            <ModalHeader>Record Substitution</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <label>
                  Minute:
                  <input
                    type="number"
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    className="border rounded w-full p-2"
                    placeholder="e.g. 19"
                  />
                </label>
                <div></div>
                <label>
                  Player Out:
                  {playingPlayers.map((player) => (
                    <label key={player.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="playerOut"
                        value={player.id}
                        checked={playerOutId === player.id}
                        onChange={() => setPlayerOutId(player.id)}
                      />
                      {player.username}
                    </label>
                  ))}
                </label>
                <label>
                  Player In:
                  {benchPlayers.map((player) => (
                    <label key={player.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="playerIn"
                        value={player.id}
                        checked={playerInId === player.id}
                        onChange={() => setPlayerInId(player.id)}
                      />
                      {player.username}
                    </label>
                  ))}
                </label>
                <label>
                  Substitution Reason:
                  {['TACTICAL', 'FITNESS', 'INJURY', 'OTHER'].map((reason) => (
                    <label key={reason} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value={reason}
                        checked={substitutionReason === reason}
                        onChange={() =>
                          setSubstitutionReason(
                            reason as
                              | 'TACTICAL'
                              | 'FITNESS'
                              | 'INJURY'
                              | 'OTHER'
                          )
                        }
                      />
                      {reason}
                    </label>
                  ))}
                </label>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onSubstitutionModalClose} color="danger">
                Cancel
              </Button>
              <Button onPress={handleConfirmSubstitution} color="primary">
                Confirm Substitution
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* SubmitButton */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit Match
        </button>
      </form>
    </FormProvider>
  );
};

export default MatchForm;
