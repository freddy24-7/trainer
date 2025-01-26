import React from 'react';

import ProtectedLayout from '@/app/ProtectedLayout';
import Instructions from '@/components/helpers/instructionsHelpers/Instructions';

export const dynamic = 'force-dynamic';

const Page: React.FC = (): React.ReactElement => {
  return (
    <ProtectedLayout requiredRole="TRAINER">
      <Instructions />
    </ProtectedLayout>
  );
};

export default Page;
