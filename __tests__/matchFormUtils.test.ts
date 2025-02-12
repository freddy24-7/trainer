import { toast } from 'react-toastify';

import { handleValidateMatchData } from '@/schemas/validation/createMatchValidation';
import {
  submitMatchForm,
  handleActionResponse,
  validateMatchForm,
} from '@/utils/matchFormUtils';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../src/schemas/validation/createMatchValidation', () => ({
  handleValidateMatchData: jest.fn(),
}));

jest.mock('../src/utils/errorUtils', () => ({
  formatError: jest.fn((msg: string) => ({
    errors: [{ message: msg }],
  })),
}));

describe('matchFormUtils', () => {
  let setSubmitting: jest.Mock;
  let validatePlayers: jest.Mock;
  let action: jest.Mock;

  beforeEach(() => {
    setSubmitting = jest.fn();
    validatePlayers = jest.fn(() => true);
    action = jest.fn();
    jest.clearAllMocks();
  });

  const errorSendMessage = 'Er is een fout opgetreden tijdens de inzending';
  const errorFormSubmission = 'Error during form submission:';

  describe('handleActionResponse', () => {
    it('returns true and shows success toast on successful submission', async () => {
      action.mockResolvedValueOnce({ errors: [] });

      const formData = new FormData();
      const result = await handleActionResponse(action, formData);

      expect(result).toBe(true);
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining('Wedstrijd succesvol toegevoegd!')
      );
    });

    it('returns false and shows error toast when submission fails', async () => {
      action.mockResolvedValueOnce({ errors: [{ message: 'Error' }] });

      const formData = new FormData();
      const result = await handleActionResponse(action, formData);

      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Fout bij het toevoegen van de wedstrijd.')
      );
    });

    it('returns false and handles unexpected errors', async () => {
      const error = new Error('Unexpected error');
      action.mockRejectedValueOnce(error);

      const formData = new FormData();

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await handleActionResponse(action, formData);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(errorFormSubmission, error);
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining(errorSendMessage)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('validateMatchForm', () => {
    it('returns false when handleValidateMatchData fails', () => {
      (handleValidateMatchData as jest.Mock).mockImplementation(() => ({
        success: false,
      }));

      const formData = new FormData();
      const result = validateMatchForm(formData, validatePlayers);

      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Validatie')
      );
    });

    it('returns false when validatePlayers fails', () => {
      (handleValidateMatchData as jest.Mock).mockImplementation(() => ({
        success: true,
      }));

      validatePlayers.mockReturnValue(false);

      const formData = new FormData();
      const result = validateMatchForm(formData, validatePlayers);

      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining(
          'Voer geldige minuten in of markeer als niet beschikbaar.'
        )
      );
    });

    it('returns true when validation passes', () => {
      (handleValidateMatchData as jest.Mock).mockImplementation(() => ({
        success: true,
      }));

      validatePlayers.mockReturnValue(true);

      const formData = new FormData();
      const result = validateMatchForm(formData, validatePlayers);

      expect(result).toBe(true);
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe('submitMatchForm', () => {
    it('submits form successfully when validation passes', async () => {
      (handleValidateMatchData as jest.Mock).mockImplementation(() => ({
        success: true,
      }));
      action.mockResolvedValueOnce({ errors: [] });

      const matchType: 'competition' | 'practice' = 'competition';

      const data = {
        matchType,
        poule: undefined,
        opponent: 5,
        opponentName: '',
        date: '2025-01-01',
        players: [{ id: 1, minutes: 90, available: true }],
        matchEvents: [],
      };

      const options = { validatePlayers, setSubmitting, action };
      const result = await submitMatchForm(data, options);

      expect(result).toBe(true);
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining('Wedstrijd succesvol toegevoegd!')
      );
    });

    it('does not submit when validation fails', async () => {
      validatePlayers.mockReturnValue(false);
      (handleValidateMatchData as jest.Mock).mockImplementation(() => ({
        success: true,
      }));

      const matchType: 'competition' | 'practice' = 'competition';

      const data = {
        matchType,
        poule: undefined,
        opponent: 5,
        opponentName: '',
        date: '2025-02-01',
        players: [{ id: 1, minutes: 90, available: true }],
        matchEvents: [],
      };

      const options = { validatePlayers, setSubmitting, action };
      const result = await submitMatchForm(data, options);

      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining(
          'Voer geldige minuten in of markeer als niet beschikbaar.'
        )
      );
      expect(action).not.toHaveBeenCalled();
    });

    it('handles unexpected errors gracefully', async () => {
      (handleValidateMatchData as jest.Mock).mockImplementation(() => ({
        success: true,
      }));
      action.mockRejectedValueOnce(new Error('Unexpected error'));

      const matchType: 'competition' | 'practice' = 'competition';

      const data = {
        matchType,
        poule: undefined,
        opponent: 5,
        opponentName: '',
        date: '2025-03-01',
        players: [{ id: 1, minutes: 90, available: true }],
        matchEvents: [],
      };

      const options = { validatePlayers, setSubmitting, action };
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await submitMatchForm(data, options);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(errorFormSubmission),
        expect.any(Error)
      );
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining(errorSendMessage)
      );

      consoleSpy.mockRestore();
    });
    it('handles unexpected errors gracefully inside submitMatchForm', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      (handleValidateMatchData as jest.Mock).mockImplementation(() => ({
        success: true,
      }));

      action.mockImplementation(() => {
        throw new Error('Unexpected test error');
      });

      const matchType: 'competition' | 'practice' = 'competition';

      const data = {
        matchType,
        poule: undefined,
        opponent: 5,
        opponentName: '',
        date: '2025-04-01',
        players: [{ id: 1, minutes: 90, available: true }],
        matchEvents: [],
      };

      const options = { validatePlayers, setSubmitting, action };

      const result = await submitMatchForm(data, options);

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining(errorFormSubmission),
        expect.any(Error)
      );
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining(errorSendMessage)
      );
      expect(setSubmitting).toHaveBeenCalledWith(false);

      (console.error as jest.Mock).mockRestore();
    });
  });
});
