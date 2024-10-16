'use client';

import React, { useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { TeamsListProps, Team } from '@/types/type-list';

export default function TeamsList({ teams, pouleName }: TeamsListProps) {
  useEffect(() => {
    console.log('TeamsList Props:', { teams, pouleName });
  }, [teams, pouleName]);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-center mb-4 text-black">
        Teams in the poule &quot;{pouleName}&quot;
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
