import React from 'react';

import AboutContent from '@/components/helpers/aboutHelpers/AboutContent';

export const dynamic = 'force-dynamic';

const Page: React.FC = (): React.ReactElement => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black-500">
      <div className="max-w-3xl w-full">
        <AboutContent />
      </div>
    </div>
  );
};

export default Page;
