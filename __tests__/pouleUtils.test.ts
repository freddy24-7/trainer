import { toast } from 'react-toastify';
import type { ZodIssue } from 'zod';

import {
  failedToAddPouleMessage,
  pouleAddedSuccessMessage,
  submissionErrorMessage,
} from '@/strings/serverStrings';
import { PouleFormValues, PouleFormControls } from '@/types/poule-types';
import { Team } from '@/types/team-types';
import { handleFormatPoules, handleSubmitPouleForm } from '@/utils/pouleUtils';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('pouleUtils', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('handleFormatPoules', () => {
    it('formats poule data correctly', () => {
      const teams: Team[] = [
        { id: 1, name: 'Team A' },
        { id: 2, name: 'Team B' },
        { id: 3, name: 'Team C' },
      ];
      const poulesData = [
        {
          id: 1,
          name: 'Poule 1',
          team: teams[0],
          opponents: [
            { id: 2, team: teams[1] },
            { id: 3, team: teams[2] },
          ],
        },
      ];

      const result = handleFormatPoules(poulesData);

      expect(result).toEqual([
        {
          id: 1,
          pouleName: 'Poule 1',
          teams: [teams[0], teams[1], teams[2]],
          opponents: [
            { id: 2, team: teams[1] },
            { id: 3, team: teams[2] },
          ],
        },
      ]);
    });

    it('returns an empty array when given an empty input', () => {
      const result = handleFormatPoules([]);
      expect(result).toEqual([]);
    });
  });

  describe('handleSubmitPouleForm', () => {
    let action: jest.Mock;
    let formControls: PouleFormControls;
    let reset: jest.Mock;
    let setOpponents: jest.Mock;
    let setShowForm: jest.Mock;

    beforeEach(() => {
      action = jest.fn();
      reset = jest.fn();
      setOpponents = jest.fn();
      setShowForm = jest.fn();

      formControls = { reset, setOpponents, setShowForm };

      jest.clearAllMocks();
    });

    it('submits form successfully and resets state', async () => {
      action.mockResolvedValueOnce({});

      const formData: PouleFormValues = {
        pouleName: 'Test Poule1',
        mainTeamName: 'Main Team',
        opponents: ['Opponent 1', 'Opponent 2'],
        opponentName: 'Opponent 1',
      };

      await handleSubmitPouleForm(formData, action, formControls);

      expect(action).toHaveBeenCalledTimes(1);
      expect(action).toHaveBeenCalledWith(null, expect.any(FormData));

      expect(toast.success).toHaveBeenCalledWith(pouleAddedSuccessMessage);
      expect(reset).toHaveBeenCalled();
      expect(setOpponents).toHaveBeenCalledWith([]);
      expect(setShowForm).toHaveBeenCalledWith(false);
    });

    it('displays an error message when submission fails with validation errors', async () => {
      const mockErrors: ZodIssue[] = [
        { path: ['pouleName'], message: 'Invalid poule name', code: 'custom' },
      ];
      action.mockResolvedValueOnce({ errors: mockErrors });

      const formData: PouleFormValues = {
        pouleName: 'Test Poule2',
        mainTeamName: 'Main Team',
        opponents: ['Opponent 3'],
        opponentName: 'Opponent 4',
      };

      await handleSubmitPouleForm(formData, action, formControls);

      expect(toast.error).toHaveBeenCalledWith(failedToAddPouleMessage);
      expect(console.error).toHaveBeenCalledWith(
        'Submission errors:',
        mockErrors
      );
    });

    it('handles unexpected errors gracefully', async () => {
      const mockError = new Error('Unexpected error');
      action.mockRejectedValueOnce(mockError);

      const formData: PouleFormValues = {
        pouleName: 'Test Poule3',
        mainTeamName: 'Main Team',
        opponents: ['Opponent 5'],
        opponentName: 'Opponent 6',
      };

      await handleSubmitPouleForm(formData, action, formControls);

      expect(toast.error).toHaveBeenCalledWith(submissionErrorMessage);
      expect(console.error).toHaveBeenCalledWith(
        'Unexpected error during form submission:',
        mockError
      );
    });

    it('correctly appends form data', async () => {
      action.mockResolvedValueOnce({});
      const appendSpy = jest.spyOn(FormData.prototype, 'append');

      const opponent = 'Opponent 7';

      const pouleData: PouleFormValues = {
        pouleName: 'Test Poule',
        mainTeamName: 'Main Team',
        opponents: [opponent, 'Opponent 8'],
        opponentName: 'Opponent 10',
      };

      await handleSubmitPouleForm(pouleData, action, formControls);

      expect(appendSpy).toHaveBeenCalledWith('pouleName', 'Test Poule');
      expect(appendSpy).toHaveBeenCalledWith('mainTeamName', 'Main Team');
      expect(appendSpy).toHaveBeenCalledWith('opponents', opponent);
      expect(appendSpy).toHaveBeenCalledWith('opponents', opponent);

      appendSpy.mockRestore();
    });
  });
});
