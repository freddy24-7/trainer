// This is a protected page that can only be accessed by users with the TRAINER role.

import ProtectedLayout from '@/app/protected-layout';
import PlayerManagementClient from '@/components/PlayerManagementClient';

export default function ManagementPage() {
  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="text-center">
          <PlayerManagementClient />
        </div>
      </div>
    </ProtectedLayout>
  );
}
