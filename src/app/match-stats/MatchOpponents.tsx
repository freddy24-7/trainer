import React from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { OpponentClientProps } from '@/types/poule-types';
import MatchDetail from '@/components/helpers/MatchDetail';

const MatchOpponents: React.FC<OpponentClientProps> = ({ matchData }) => {
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
              <MatchDetail key={match.id} match={match} />
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default MatchOpponents;
