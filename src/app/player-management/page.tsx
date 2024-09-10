// This is a protected page that can only be accessed by users with the TRAINER role.

import ProtectedLayout from '@/app/protected-layout';
import AddPlayerForm from '@/components/AddPlayerForm';

const ManagementPage = () => {
  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4 text-black">
            Player Management
          </h2>
          {/* AddPlayerForm is only accessible if the user is a TRAINER */}
          <AddPlayerForm />
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default ManagementPage;
