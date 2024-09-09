// This is a protected page that can only be accessed by users with the TRAINER role.

import ProtectedLayout from '@/app/protected-layout';

const ManagementPage = () => {
  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div>
        {/* Content visible only to TRAINER role */}
        <div>Hello from ManagementPage</div>
      </div>
    </ProtectedLayout>
  );
};

export default ManagementPage;
