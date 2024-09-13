// This server component fetches the teams in a poule and renders the list of teams.

import ProtectedLayout from '@/app/protected-layout';
import addPoule from '@/app/actions/addPoule';
import { getTeamsInPoule } from '@/app/actions/getTeamsInPoule';
import PouleManagementClient from '@/components/PouleManagementClient';
import { AddPouleFormValidation } from '@/components/AddPouleFormValidation';

interface Team {
  id: number;
  name: string;
}

export default async function PouleManagementPage() {
  // Fetch the teams in the poule defined by the user
  const response = await getTeamsInPoule();

  // Check if there is no poule yet and handle that scenario
  if (!response.success) {
    // Render the form to create a new poule if none exist
    return (
      <ProtectedLayout requiredRole="TRAINER">
        <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
          <div className="text-center">
            <p className="text-red-500 mb-4">{response.error}</p>
            <AddPouleFormValidation action={addPoule} />
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  // Safely handle teams by checking if they are defined
  const teams: Team[] = response.teams
    ? response.teams.map((team) => ({
        id: team.id,
        name: team.name ?? '',
      }))
    : [];

  // Extract poule name from the response
  const pouleName = response.pouleName ?? 'Unknown Poule';

  console.log('PouleManagementPage:', { teams, pouleName }); // Debugging log

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="text-center">
          {/* Display the list of teams for the existing poule */}
          <PouleManagementClient teams={teams} pouleName={pouleName} />
        </div>
      </div>
    </ProtectedLayout>
  );
}
