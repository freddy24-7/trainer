'use client';

import React from 'react';

import TeamsList from '@/components/poules/TeamsList';
import { PouleManagementClientProps } from '@/types/types';

export default function PouleManagementClient({
  poules,
}: PouleManagementClientProps): React.ReactNode {
  return (
    <div className="text-center">
      {poules.map((poule) => (
        <div key={poule.id} className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-black">
            Poule: {poule.pouleName}
          </h2>
          <TeamsList teams={poule.teams} pouleName={poule.pouleName} />
        </div>
      ))}
    </div>
  );
}
