// This component is a client-side implementation of the Player Management feature.

'use client';

import React, { useState } from 'react';
import TeamsList from '@/components/TeamsList';
import { AddPouleFormValidation } from '@/components/AddPouleFormValidation';
import addPoule from '@/app/actions/addPoule';

interface Team {
  id: number;
  name: string;
}

interface Poule {
  pouleName: string;
  teams: Team[];
}

interface PouleManagementClientProps {
  poules: Poule[];
}

export default function PouleManagementClient({
  poules,
}: PouleManagementClientProps) {
  const [showAddPouleForm, setShowAddPouleForm] = useState(false);

  const handlePouleAdded = () => {
    setShowAddPouleForm(false);
  };

  const toggleAddPouleForm = () => {
    setShowAddPouleForm((prev) => !prev);
  };

  return (
    <div>
      {poules.map((poule, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Poule: {poule.pouleName}
          </h2>
          <TeamsList teams={poule.teams} pouleName={poule.pouleName} />
        </div>
      ))}

      <button
        onClick={toggleAddPouleForm}
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {showAddPouleForm ? 'Cancel' : 'Add Another Poule'}
      </button>

      {showAddPouleForm && (
        <div className="mt-6">
          <AddPouleFormValidation
            action={addPoule}
            onPouleAdded={handlePouleAdded}
          />
        </div>
      )}
    </div>
  );
}
