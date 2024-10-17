import React from 'react';
import PouleItem from '@/components/helpers/PouleItem';
import { PouleManagementClientProps } from '@/types/poule-types';

const Mapper: React.FC<PouleManagementClientProps> = ({ poules }) => {
  return (
    <div className="text-center">
      {poules.map((poule) => (
        <PouleItem key={poule.id} poule={poule} />
      ))}
    </div>
  );
};

export default Mapper;
