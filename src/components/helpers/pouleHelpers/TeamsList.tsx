'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import React, { useEffect } from 'react';

import { teamsInPouleLabel } from '@/strings/clientStrings';
import { TeamsListProps, Team } from '@/types/team-types';

export default function TeamsList({
  teams,
  pouleName,
}: TeamsListProps): React.ReactElement {
  useEffect(() => {
    console.log('TeamsList Props:', { teams, pouleName });
  }, [teams, pouleName]);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-center mb-4 text-black">
        {teamsInPouleLabel.replace('{pouleName}', pouleName)}
      </h2>

      <ul>
        {teams.map((team: Team, index: number) => (
          <Card
            key={team.id}
            className={`max-w-md mx-auto mb-4 ${index === 0 ? 'bg-brandcolor' : ''}`}
          >
            <CardHeader className="flex justify-between items-center">
              <span className="text-md">{team.name}</span>
            </CardHeader>
            <CardBody>
              <div className="flex justify-end space-x-2"></div>
            </CardBody>
          </Card>
        ))}
      </ul>
    </div>
  );
}
