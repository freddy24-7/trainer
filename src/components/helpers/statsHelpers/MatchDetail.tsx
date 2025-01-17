import { format } from 'date-fns';
import React from 'react';

import { MatchDetailProps } from '@/types/match-types';

const MatchDetail: React.FC<MatchDetailProps> = ({ match }) => {
  return (
    <div className="mb-6 border-b pb-4">
      <h3 className="text-xl font-semibold mb-2">
        Tegenstander: {match.opponentTeamName}
      </h3>
      <p className="mb-2">
        <strong>Datum gespeeld:</strong>{' '}
        {format(new Date(match.date), 'dd/MM/yyyy')}
      </p>
      <p className="mb-2">
        <strong>Afwezige spelers:</strong>
      </p>
      {match.absentPlayers.length > 0 ? (
        <ul className="list-disc list-inside">
          {match.absentPlayers.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
      ) : (
        <p>Alle spelers waren beschikbaar.</p>
      )}
    </div>
  );
};

export default MatchDetail;
