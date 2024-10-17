import React from 'react';
import { format } from 'date-fns';
import { MatchData } from '@/types/match-types';

interface MatchDetailProps {
  match: MatchData;
}

const MatchDetail: React.FC<MatchDetailProps> = ({ match }) => {
  return (
    <div className="mb-6 border-b pb-4">
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
  );
};

export default MatchDetail;
