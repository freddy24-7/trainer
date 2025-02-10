'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import React from 'react';

import PlayerStatsTable from '@/components/helpers/matchStatsHelpers/PlayerStatsTable';
import { playerStatisticsHeader } from '@/strings/clientStrings';
import { MatchClientProps } from '@/types/stats-types';

const MatchStats: React.FC<MatchClientProps> = ({ playerStats }) => {
  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">{playerStatisticsHeader}</h2>
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
