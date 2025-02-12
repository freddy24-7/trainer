import { UseFormSetValue } from 'react-hook-form';
import { toast } from 'react-toastify';

import { incompleteSubstitutionErrorMessage } from '@/strings/clientStrings';
import {
  MatchFormValues,
  SubstitutionData,
  GameState,
  Substitution,
} from '@/types/match-types';
import { handleSubstitution } from '@/utils/playerManagementUtils';
import {
  processSubstitution,
  handleSubstitutionChange,
  handleAddSubstitution,
  handleRemoveSubstitution,
  handleConfirmAllAtOnce,
} from '@/utils/substitutionUtils';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('../src/utils/playerManagementUtils', () => ({
  handleSubstitution: jest.fn(),
}));

describe('substitutionUtils', () => {
  let setValue: jest.MockedFunction<UseFormSetValue<MatchFormValues>>;
  let setPlayerStates: jest.Mock;
  let setSubstitutions: jest.Mock;
  let setOpen: jest.Mock;
  let setMinute: jest.Mock;

  beforeEach(() => {
    setValue = jest.fn();
    setPlayerStates = jest.fn();
    setSubstitutions = jest.fn();
    setOpen = jest.fn();
    setMinute = jest.fn();
    jest.clearAllMocks();
  });

  describe('processSubstitution', () => {
    it('updates match events and player states correctly', () => {
      const substitutionData: SubstitutionData = {
        minute: 45,
        playerInId: 2,
        playerOutId: 1,
        substitutionReason: 'TACTICAL',
      };
      const gameState: GameState = {
        matchEvents: [],
        playerStates: { 1: 'playing', 2: 'bench' },
      };

      const mockUpdatedEvents = [
        {
          minute: 45,
          playerInId: 2,
          playerOutId: 1,
          eventType: 'SUBSTITUTION',
          substitutionReason: 'TACTICAL',
        },
      ];
      const mockUpdatedStates = { 1: 'bench', 2: 'playing' };

      (handleSubstitution as jest.Mock).mockReturnValue({
        updatedMatchEvents: mockUpdatedEvents,
        updatedPlayerStates: mockUpdatedStates,
      });

      processSubstitution(
        substitutionData,
        gameState,
        setValue,
        setPlayerStates
      );

      expect(handleSubstitution).toHaveBeenCalledWith(
        substitutionData,
        gameState
      );
      expect(setValue).toHaveBeenCalledWith('matchEvents', mockUpdatedEvents);
      expect(setPlayerStates).toHaveBeenCalledWith(mockUpdatedStates);
    });
  });

  describe('handleSubstitutionChange', () => {
    it('updates substitution data correctly', () => {
      const substitutions: Substitution[] = [
        { playerOutId: 1, playerInId: null, substitutionReason: null },
      ];
      setSubstitutions.mockImplementation((callback) =>
        callback(substitutions)
      );

      handleSubstitutionChange(setSubstitutions, 1, 'playerInId', 5);

      expect(setSubstitutions).toHaveBeenCalledWith(expect.any(Function));
      expect(setSubstitutions).toHaveReturnedWith([
        { playerOutId: 1, playerInId: 5, substitutionReason: null },
      ]);
    });

    it('updates substitution reason correctly', () => {
      const substitutions: Substitution[] = [
        { playerOutId: 1, playerInId: 5, substitutionReason: null },
      ];
      setSubstitutions.mockImplementation((callback) =>
        callback(substitutions)
      );

      handleSubstitutionChange(
        setSubstitutions,
        1,
        'substitutionReason',
        'INJURY'
      );

      expect(setSubstitutions).toHaveBeenCalledWith(expect.any(Function));
      expect(setSubstitutions).toHaveReturnedWith([
        { playerOutId: 1, playerInId: 5, substitutionReason: 'INJURY' },
      ]);
    });
  });

  describe('handleAddSubstitution', () => {
    it('adds a new substitution entry', () => {
      const substitutions: Substitution[] = [
        { playerOutId: 1, playerInId: 2, substitutionReason: 'TACTICAL' },
      ];
      setSubstitutions.mockImplementation((callback) =>
        callback(substitutions)
      );

      handleAddSubstitution(setSubstitutions, 3);

      expect(setSubstitutions).toHaveBeenCalledWith(expect.any(Function));
      expect(setSubstitutions).toHaveReturnedWith([
        ...substitutions,
        { playerOutId: 3, playerInId: null, substitutionReason: null },
      ]);
    });
  });

  describe('handleRemoveSubstitution', () => {
    it('removes a substitution entry', () => {
      const substitutions: Substitution[] = [
        { playerOutId: 1, playerInId: 5, substitutionReason: 'TACTICAL' },
        { playerOutId: 2, playerInId: 6, substitutionReason: 'INJURY' },
      ];
      setSubstitutions.mockImplementation((callback) =>
        callback(substitutions)
      );

      handleRemoveSubstitution(setSubstitutions, 1);

      expect(setSubstitutions).toHaveBeenCalledWith(expect.any(Function));
      expect(setSubstitutions).toHaveReturnedWith([
        { playerOutId: 2, playerInId: 6, substitutionReason: 'INJURY' },
      ]);
    });
  });

  describe('handleConfirmAllAtOnce', () => {
    it('shows error toast if minute is empty', () => {
      const substitutions: Substitution[] = [
        { playerOutId: 1, playerInId: 5, substitutionReason: 'TACTICAL' },
      ];
      handleConfirmAllAtOnce({
        minute: '',
        substitutions,
        matchEvents: [],
        playerStates: {},
        setValue,
        setPlayerStates,
        setOpen,
        setMinute,
        setSubstitutions,
      });

      expect(toast.error).toHaveBeenCalledWith(
        incompleteSubstitutionErrorMessage
      );
    });

    it('shows error toast if any substitution is incomplete', () => {
      const substitutions: Substitution[] = [
        { playerOutId: 1, playerInId: null, substitutionReason: 'TACTICAL' },
      ];
      handleConfirmAllAtOnce({
        minute: 45,
        substitutions,
        matchEvents: [],
        playerStates: {},
        setValue,
        setPlayerStates,
        setOpen,
        setMinute,
        setSubstitutions,
      });

      expect(toast.error).toHaveBeenCalledWith(
        incompleteSubstitutionErrorMessage
      );
    });

    it('correctly updates match events and player states', () => {
      const substitutions: Substitution[] = [
        { playerOutId: 1, playerInId: 5, substitutionReason: 'TACTICAL' },
      ];
      const playerStates: Record<number, 'playing' | 'bench' | 'absent'> = {
        1: 'playing',
        5: 'bench',
      };

      handleConfirmAllAtOnce({
        minute: 45,
        substitutions,
        matchEvents: [],
        playerStates,
        setValue,
        setPlayerStates,
        setOpen,
        setMinute,
        setSubstitutions,
      });

      expect(setValue).toHaveBeenCalledWith('matchEvents', [
        {
          minute: 45,
          playerInId: 5,
          playerOutId: 1,
          eventType: 'SUBSTITUTION',
          substitutionReason: 'TACTICAL',
        },
      ]);

      expect(setPlayerStates).toHaveBeenCalledWith({
        1: 'bench',
        5: 'playing',
      });

      expect(setOpen).toHaveBeenCalledWith(false);
      expect(setMinute).toHaveBeenCalledWith('');
      expect(setSubstitutions).toHaveBeenCalledWith([]);
    });
  });
});
