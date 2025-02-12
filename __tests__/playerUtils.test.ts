import { handleValidateMatchPlayerData } from '@/schemas/validation/addMatchPlayerValidation';
import {
  playersDataMissingMessage,
  playersDataNotArrayMessage,
  invalidMinutesValueMessage,
} from '@/strings/serverStrings';
import { MatchFormValues, PlayerInMatch } from '@/types/match-types';
import { Player, PlayerResponseData } from '@/types/user-types';
import { formatError } from '@/utils/errorUtils';
import {
  handleMapPlayers,
  updatePlayerList,
  validateAllPlayers,
  handleParsePlayersData,
  handleValidatePlayerData,
} from '@/utils/playerUtils';

jest.mock('../src/utils/errorUtils', () => ({
  formatError: jest.fn((msg: string) => ({
    errors: [{ message: msg }],
  })),
}));

jest.mock('../src/schemas/validation/addMatchPlayerValidation', () => ({
  handleValidateMatchPlayerData: jest.fn(),
}));

describe('playerUtils', () => {
  describe('handleMapPlayers', () => {
    it('correctly maps a successful response with players', () => {
      const response: Partial<PlayerResponseData> = {
        success: true,
        players: [
          { id: 1, username: 'JohnDoe', whatsappNumber: '123456789' },
          { id: 2, username: 'JaneDoe', whatsappNumber: '987654321' },
        ],
      };

      const expectedOutput: Player[] = [
        { id: 1, username: 'JohnDoe', whatsappNumber: '123456789' },
        { id: 2, username: 'JaneDoe', whatsappNumber: '987654321' },
      ];

      expect(handleMapPlayers(response)).toEqual(expectedOutput);
    });

    it('returns an empty array if response is unsuccessful', () => {
      expect(handleMapPlayers({ success: false })).toEqual([]);
    });

    it('returns an empty array if players field is missing', () => {
      expect(handleMapPlayers({ success: true })).toEqual([]);
    });
  });

  describe('updatePlayerList', () => {
    it('updates a player in the list and sets submitting to false', () => {
      const setPlayers = jest.fn();
      const setSubmitting = jest.fn();
      const updatedPlayer: Player = { id: 2, username: 'UpdatedUser' };

      setPlayers.mockImplementation((callback) => {
        const players: Player[] = [
          { id: 1, username: 'John' },
          { id: 2, username: 'Jane' },
        ];
        return callback(players);
      });

      updatePlayerList(updatedPlayer, setPlayers, setSubmitting);

      expect(setPlayers).toHaveBeenCalledWith(expect.any(Function));
      expect(setSubmitting).toHaveBeenCalledWith(false);
    });
  });

  describe('validateAllPlayers', () => {
    it('returns true when all players pass validation', () => {
      (handleValidateMatchPlayerData as jest.Mock).mockReturnValue({
        success: true,
      });

      const players: MatchFormValues['players'] = [
        { id: 1, minutes: 90, available: true },
        { id: 2, minutes: 45, available: true },
      ];

      expect(validateAllPlayers(players, 1)).toBe(true);
    });

    it('returns false when any player fails validation', () => {
      (handleValidateMatchPlayerData as jest.Mock).mockReturnValueOnce({
        success: false,
      });

      const players: MatchFormValues['players'] = [
        { id: 1, minutes: 90, available: true },
        { id: 2, minutes: 45, available: true },
      ];

      expect(validateAllPlayers(players, 1)).toBe(false);
    });
  });

  describe('handleParsePlayersData', () => {
    it('returns an error if input is null', () => {
      const result = handleParsePlayersData(null);
      expect(formatError).toHaveBeenCalledWith(playersDataMissingMessage, [
        'players',
      ]);
      expect(result.errors).toEqual([{ message: playersDataMissingMessage }]);
    });

    it('returns an error if input is not valid JSON', () => {
      const result = handleParsePlayersData('{invalidJson}');

      expect(formatError).toHaveBeenCalledWith(
        expect.stringMatching(
          /^Onbekende fout bij het verwerken van spelersgegevens\./
        ),
        ['players']
      );

      expect(result.errors).toEqual([
        {
          message: expect.stringMatching(
            /^Onbekende fout bij het verwerken van spelersgegevens\./
          ),
        },
      ]);
    });

    it('returns an error if parsed JSON is not an array', () => {
      const result = handleParsePlayersData('{"id": 1, "minutes": 90}');
      expect(formatError).toHaveBeenCalledWith(playersDataNotArrayMessage, [
        'players',
      ]);
      expect(result.errors).toEqual([{ message: playersDataNotArrayMessage }]);
    });

    it('returns players if JSON is valid', () => {
      const json = JSON.stringify([
        { id: 1, minutes: '90', available: true },
        { id: 2, minutes: '45', available: true },
      ]);

      const result = handleParsePlayersData(json);
      expect(result.players).toEqual([
        { id: 1, minutes: '90', available: true },
        { id: 2, minutes: '45', available: true },
      ]);
      expect(result.errors).toBeUndefined();
    });
  });

  describe('handleValidatePlayerData', () => {
    it('returns valid response for a correctly formatted player', () => {
      const player: PlayerInMatch = { id: 1, minutes: '90', available: true };
      const result = handleValidatePlayerData(player);

      expect(result.isValid).toBe(true);
      expect(result.parsedMinutes).toBe(90);
      expect(result.errors).toEqual([]);
    });

    it('returns valid response for an unavailable player with zero minutes', () => {
      const player: PlayerInMatch = { id: 1, minutes: '90', available: false };
      const result = handleValidatePlayerData(player);

      expect(result.isValid).toBe(true);
      expect(result.parsedMinutes).toBe(0);
      expect(result.errors).toEqual([]);
    });

    it('returns an error when minutes value is invalid', () => {
      const player: PlayerInMatch = {
        id: 1,
        minutes: 'invalid',
        available: true,
      };
      const result = handleValidatePlayerData(player);

      expect(result.isValid).toBe(false);
      expect(result.parsedMinutes).toBe(0);
      expect(formatError).toHaveBeenCalledWith(
        invalidMinutesValueMessage.replace('{id}', '1'),
        ['players', 'minutes']
      );
    });

    it('returns an error when minutes value is negative', () => {
      const player: PlayerInMatch = { id: 1, minutes: '-10', available: true };
      const result = handleValidatePlayerData(player);

      expect(result.isValid).toBe(false);
      expect(result.parsedMinutes).toBe(0);
      expect(formatError).toHaveBeenCalledWith(
        invalidMinutesValueMessage.replace('{id}', '1'),
        ['players', 'minutes']
      );
    });
  });
});
