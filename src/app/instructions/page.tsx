import React from 'react';

import Instructions from '@/app/instructions/Instructions';
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
