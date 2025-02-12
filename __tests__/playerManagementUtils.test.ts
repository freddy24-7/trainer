import { MatchFormValues } from '@/types/match-types';
import { Player } from '@/types/user-types';
import {
  calculatePlayerMinutes,
  handlePlayerStateChange,
  handleSubstitution,
} from '@/utils/playerManagementUtils';

describe('playerManagementUtils', () => {
  describe('calculatePlayerMinutes', () => {
    it('calculates minutes correctly for players without substitutions', () => {
      const players: Player[] = [{ id: 1, username: 'John' }];
      const matchEvents: MatchFormValues['matchEvents'] = [];
      const startingLineup = [1];
      const matchDuration = 90;

      const result = calculatePlayerMinutes(
        players,
        matchEvents,
        startingLineup,
        matchDuration
      );

      expect(result).toEqual({ 1: 90 });
    });

    it('calculates minutes correctly with substitutions', () => {
      const players: Player[] = [
        { id: 1, username: 'John' },
        { id: 2, username: 'Mike' },
      ];
      const matchEvents: MatchFormValues['matchEvents'] = [
        {
          minute: 30,
          playerInId: 2,
          playerOutId: 1,
          eventType: 'SUBSTITUTION',
        },
      ];
      const startingLineup = [1];
      const matchDuration = 90;

      const result = calculatePlayerMinutes(
        players,
        matchEvents,
        startingLineup,
        matchDuration
      );

      expect(result).toEqual({ 1: 30, 2: 60 });
    });

    it('handles multiple substitutions correctly', () => {
      const players: Player[] = [
        { id: 1, username: 'John' },
        { id: 2, username: 'Mike' },
        { id: 3, username: 'Jake' },
      ];
      const matchEvents: MatchFormValues['matchEvents'] = [
        {
          minute: 30,
          playerInId: 2,
          playerOutId: 1,
          eventType: 'SUBSTITUTION',
        },
        {
          minute: 60,
          playerInId: 3,
          playerOutId: 2,
          eventType: 'SUBSTITUTION',
        },
      ];
      const startingLineup = [1];
      const matchDuration = 90;

      const result = calculatePlayerMinutes(
        players,
        matchEvents,
        startingLineup,
        matchDuration
      );

      expect(result).toEqual({ 1: 30, 2: 30, 3: 30 });
    });

    it('returns zero minutes for players who never played', () => {
      const players: Player[] = [
        { id: 1, username: 'John' },
        { id: 2, username: 'Mike' },
      ];
      const matchEvents: MatchFormValues['matchEvents'] = [];
      const startingLineup: number[] = [];
      const matchDuration = 90;

      const result = calculatePlayerMinutes(
        players,
        matchEvents,
        startingLineup,
        matchDuration
      );

      expect(result).toEqual({ 1: 0, 2: 0 });
    });
  });

  describe('handlePlayerStateChange', () => {
    it('moves a player to the playing state', () => {
      const playerStates = { 1: 'bench', 2: 'playing' } as const;
      const startingLineup = [2];

      const { updatedPlayerStates, updatedStartingLineup } =
        handlePlayerStateChange(1, 'playing', playerStates, startingLineup);

      expect(updatedPlayerStates).toEqual({ 1: 'playing', 2: 'playing' });
      expect(updatedStartingLineup).toContain(1);
    });

    it('moves a player to the bench', () => {
      const playerStates = { 1: 'playing', 2: 'playing' } as const;
      const startingLineup = [1, 2];

      const { updatedPlayerStates, updatedStartingLineup } =
        handlePlayerStateChange(1, 'bench', playerStates, startingLineup);

      expect(updatedPlayerStates).toEqual({ 1: 'bench', 2: 'playing' });
      expect(updatedStartingLineup).not.toContain(1);
    });

    it('moves a player to absent', () => {
      const playerStates = { 1: 'playing', 2: 'bench' } as const;
      const startingLineup = [1];

      const { updatedPlayerStates, updatedStartingLineup } =
        handlePlayerStateChange(1, 'absent', playerStates, startingLineup);

      expect(updatedPlayerStates).toEqual({ 1: 'absent', 2: 'bench' });
      expect(updatedStartingLineup).not.toContain(1);
    });
  });

  describe('handleSubstitution', () => {
    it('adds a substitution event and updates player states', () => {
      const gameState = {
        matchEvents: [],
        playerStates: { 1: 'playing', 2: 'bench' } as Record<
          number,
          'bench' | 'playing' | 'absent'
        >,
      };

      const substitutionData = {
        minute: 45,
        playerInId: 2,
        playerOutId: 1,
        substitutionReason: 'TACTICAL' as const,
      };

      const { updatedMatchEvents, updatedPlayerStates } = handleSubstitution(
        substitutionData,
        gameState
      );

      expect(updatedMatchEvents).toEqual([
        {
          playerInId: 2,
          playerOutId: 1,
          minute: 45,
          eventType: 'SUBSTITUTION',
          substitutionReason: 'TACTICAL',
        },
      ]);
      expect(updatedPlayerStates).toEqual({ 1: 'bench', 2: 'playing' });
    });
  });
});
