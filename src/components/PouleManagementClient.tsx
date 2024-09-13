// This component renders a list of teams in a poule
'use client';

import React, { useEffect, useState } from 'react';
import TeamsList from '@/components/TeamsList';
import { Spinner } from '@nextui-org/spinner';

interface Team {
  id: number;
  name: string;
}

interface PouleManagementClientProps {
  teams: Team[];
  pouleName: string;
}

export default function PouleManagementClient({
  teams,
  pouleName,
}: PouleManagementClientProps) {
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    console.log('PouleManagementClient Props:', { teams, pouleName });

    // Simulating a delay to show the spinner
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Cleanup function to clear the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, [teams, pouleName]);

  return (
    <div>
      {loading && (
        <div className="flex justify-center my-4">
          <Spinner size="lg" color="success" />
        </div>
      )}

      {!loading && <TeamsList teams={teams} pouleName={pouleName} />}
    </div>
  );
}
