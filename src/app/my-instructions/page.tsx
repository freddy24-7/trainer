import React from 'react';

import ProtectedLayout from '@/app/ProtectedLayout';
import PlayerInstructions from '@/components/helpers/instructionsHelpers/PlayerInstructions';

const Page = (): React.ReactElement => {
  return (
    <ProtectedLayout requiredRole="PLAYER">
      <PlayerInstructions />
    </ProtectedLayout>
  );
};

export default Page;
