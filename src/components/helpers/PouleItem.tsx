import React from 'react';
import TeamsList from '@/components/TeamsList';
import { Poule } from '@/types/poule-types';

interface PouleItemProps {
  poule: Poule;
}

const PouleItem: React.FC<PouleItemProps> = ({ poule }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2 text-black">
        Poule: {poule.pouleName}
      </h2>
      <TeamsList teams={poule.teams} pouleName={poule.pouleName} />
    </div>
  );
};

export default PouleItem;
