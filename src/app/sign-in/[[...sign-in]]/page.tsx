import { SignIn } from '@clerk/nextjs';
import React from 'react';

export default function Page(): React.ReactElement {
  return (
    <div className="flex items-center justify-center flex-col gap-10">
      <SignIn />
    </div>
  );
}
