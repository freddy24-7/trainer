'use client';

import { Card, CardHeader, CardBody } from '@nextui-org/react';
import React from 'react';

import MatchDetail from '@/components/helpers/MatchDetail';
import { OpponentClientProps } from '@/types/shared-types';

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
