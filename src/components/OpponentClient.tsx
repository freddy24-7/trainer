import React from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { format } from 'date-fns';
import { OpponentClientProps } from '@/lib/types';

const OpponentClient: React.FC<OpponentClientProps> = ({ matchData }) => {
  return (
    <div className="mt-8 w-full max-w-4xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Match Details</h2>
        </CardHeader>
        <CardBody>
          {matchData.length === 0 ? (
            <p>No match data available.</p>
          ) : (
            matchData.map((match) => (
              <div key={match.id} className="mb-6 border-b pb-4">
                <h3 className="text-xl font-semibold mb-2">
                  Opponent: {match.opponentTeamName}
                </h3>
                <p className="mb-2">
                  <strong>Date Played:</strong>{' '}
                  {format(new Date(match.date), 'dd/MM/yyyy')}
                </p>
                <p className="mb-2">
                  <strong>Absent Players:</strong>
                </p>
                {match.absentPlayers.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {match.absentPlayers.map((player, index) => (
                      <li key={index}>{player}</li>
                    ))}
                  </ul>
                ) : (
                  <p>All players were available.</p>
                )}
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default OpponentClient;
