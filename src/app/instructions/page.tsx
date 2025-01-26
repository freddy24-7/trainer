import React from 'react';

import Instructions from '@/components/helpers/instructionsHelpers/Instructions';
import ProtectedLayout from '@/app/ProtectedLayout';

export const dynamic = 'force-dynamic';

const Page: React.FC = (): React.ReactElement => {
  return (
    <ProtectedLayout requiredRole="TRAINER">
      <Instructions />
    </ProtectedLayout>
  );
};

export default Page;
