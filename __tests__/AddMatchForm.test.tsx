jest.spyOn(console, 'log').mockImplementation(() => {});
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { AddMatchForm } from '@/app/matches/AddMatchForm';
import { Poule } from '@/types/poule-types';
import { Player } from '@/types/user-types';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

let opponentProvided = 'Opponent Provided';

let mockFormValues: Record<string, any> = {
  date: '2025-02-15',
  matchType: 'competition',
  poule: 1,
  opponentName: opponentProvided,
  players: [{ id: 1, minutes: 90, available: true }],
  opponentStrength: 'SIMILAR',
  matchEvents: [],
};

jest.mock('../src/hooks/useMatchFormConfig', () => ({
  useMatchFormConfig: () => ({
    watch: (field: string) => mockFormValues[field],
    setValue: jest.fn(),
    getValues: (field: string) => mockFormValues[field],
    formState: { errors: {} },
  }),
}));

jest.mock(
  '../src/components/helpers/matchHelpers/MatchFormFieldHelpers',
  () => {
    return function DummyMatchForm(props: any) {
      const { onSubmit, methods, selectedPoule, selectedOpponent } = props;
      return (
        <div>
          {/* Render poule and opponent names so that the original tests can find them */}
          {selectedPoule && (
            <div data-testid="poule-name">{selectedPoule.pouleName}</div>
          )}
          {selectedOpponent && (
            <div data-testid="opponent-name">{selectedOpponent.team.name}</div>
          )}
          <button
            data-testid="submit-button"
            onClick={() =>
              onSubmit({
                date: methods.getValues('date'),
                matchType: methods.getValues('matchType'),
                poule: methods.getValues('poule'),
                opponentName: methods.getValues('opponentName'),
                players: methods.getValues('players'),
                opponentStrength: methods.getValues('opponentStrength'),
                matchEvents: methods.getValues('matchEvents'),
              })
            }
          >
            Submit
          </button>
        </div>
      );
    };
  }
);

import { submitMatchForm } from '@/utils/matchFormUtils';
jest.mock('../src/utils/matchFormUtils', () => ({
  submitMatchForm: jest.fn(),
}));

const pouleName = 'Poule 1';
const teamName = 'Team 1';
const opponentName = 'Opponent 1';
const player1Name = 'Player 1';
const player2Name = 'Player 2';
const whatsappNumber = '123456789';

describe('AddMatchForm', () => {
  const mockAction = jest.fn();
  const testButton = 'submit-button';

  const mockPoule: Poule = {
    id: 1,
    pouleName: pouleName,
    teams: [{ id: 1, name: teamName }],
    opponents: [{ id: 1, team: { id: 1, name: opponentName } }],
  };

  const mockPlayers: Player[] = [
    { id: 1, username: player1Name, whatsappNumber: whatsappNumber },
    { id: 2, username: player2Name, whatsappNumber: whatsappNumber },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormValues = {
      date: '2025-03-15',
      matchType: 'competition',
      poule: 1,
      opponentName: opponentProvided,
      players: [{ id: 1, minutes: 90, available: true }],
      opponentStrength: 'SIMILAR',
      matchEvents: [],
    };
  });

  it('should render the form and the default poule and opponent', () => {
    render(
      <AddMatchForm
        action={mockAction}
        poules={[mockPoule]}
        players={mockPlayers}
      />
    );

    const pouleElement = screen.getByTestId('poule-name');
    const opponentElement = screen.getByTestId('opponent-name');

    expect(pouleElement).toBeInTheDocument();
    expect(pouleElement).toHaveTextContent(pouleName);
    expect(opponentElement).toBeInTheDocument();
    expect(opponentElement).toHaveTextContent(opponentName);
  });

  it('should change selected poule and opponent', () => {
    render(
      <AddMatchForm
        action={mockAction}
        poules={[mockPoule]}
        players={mockPlayers}
      />
    );

    const pouleElement = screen.getByTestId('poule-name');
    fireEvent.click(pouleElement);

    const opponentElement = screen.getByTestId('opponent-name');
    fireEvent.click(opponentElement);

    expect(pouleElement).toBeInTheDocument();
    expect(opponentElement).toBeInTheDocument();
  });

  it('should not submit if the date is missing', async () => {
    mockFormValues.date = null;

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <AddMatchForm
        action={mockAction}
        poules={[mockPoule]}
        players={mockPlayers}
      />
    );

    const submitButton = screen.getByTestId(testButton);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Validation Error: Date is required.'
      );
    });
    expect(submitMatchForm).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should fail validation when matchType is "practice" and opponentName is empty', async () => {
    mockFormValues.matchType = 'practice';
    mockFormValues.opponentName = '';
    mockFormValues.date = '2025-04-15';

    (submitMatchForm as jest.Mock).mockResolvedValue(false);

    render(
      <AddMatchForm
        action={mockAction}
        poules={[mockPoule]}
        players={mockPlayers}
      />
    );

    const submitButton = screen.getByTestId(testButton);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitMatchForm).toHaveBeenCalled();
    });
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('should submit the form and navigate when submission is successful', async () => {
    mockFormValues.date = '2025-02-15';
    mockFormValues.matchType = 'competition';
    mockFormValues.opponentName = opponentProvided;

    (submitMatchForm as jest.Mock).mockResolvedValue(true);

    render(
      <AddMatchForm
        action={mockAction}
        poules={[mockPoule]}
        players={mockPlayers}
      />
    );

    const submitButton = screen.getByTestId(testButton);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitMatchForm).toHaveBeenCalled();
    });
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
