import { format } from 'date-fns';
import React from 'react';

import {
  opponentLabel,
  matchDateLabel,
  absentPlayersLabel,
  allPlayersAvailableMessage,
} from '@/strings/clientStrings';
import { MatchDetailProps } from '@/types/match-types';

const MatchDetail: React.FC<MatchDetailProps> = ({ match }) => {
  return (
    <div className="mb-6 border-b pb-4">
      <h3 className="text-xl font-semibold mb-2">
        {opponentLabel} {match.opponentTeamName}
      </h3>

      <p className="mb-2">
        <strong>{matchDateLabel}</strong>{' '}
        {format(new Date(match.date), 'dd/MM/yyyy')}
      </p>

      <p className="mb-2">
        <strong>{absentPlayersLabel}</strong>
      </p>

      {match.absentPlayers.length > 0 ? (
        <ul className="list-disc list-inside">
          {match.absentPlayers.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
      ) : (
        <p>{allPlayersAvailableMessage}</p>
      )}
    </div>
  );
};

export default MatchDetail;
