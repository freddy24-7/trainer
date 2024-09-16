// This component is used to select a poule from a list of poules.

import React from 'react';
import { PouleSelectorProps } from '@/lib/types';

const PouleSelector: React.FC<PouleSelectorProps> = ({
  poules,
  selectedPoule,
  onPouleChange,
}) => {
  return (
    <div>
      <label className="block mb-2">
        Poule:
        <select
          value={selectedPoule?.id || ''}
          onChange={(e) => onPouleChange(parseInt(e.target.value))}
          className="input-class w-full p-2 border rounded mt-1 bg-white text-black"
        >
          {poules.map((poule) => (
            <option key={poule.id} value={poule.id}>
              {poule.pouleName}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default PouleSelector;
