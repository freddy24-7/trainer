import { Card, CardHeader, CardBody } from '@nextui-org/react';
import React from 'react';

import PlayerStatsTable from '@/components/helpers/PlayerStatsTable';
import { MatchClientProps } from '@/types/match-types';

const MatchStats: React.FC<MatchClientProps> = ({ playerStats }) => {
  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Player Statistics</h2>
        </CardHeader>
        <CardBody>
          <table className="min-w-full table-auto">
            <PlayerStatsTable playerStats={playerStats} />
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default MatchStats;
