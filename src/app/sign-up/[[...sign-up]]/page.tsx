import { SignUp } from '@clerk/nextjs';
import React from 'react';

export default function SignUpPage(): React.ReactElement {
  return (
    <div className="flex items-center justify-center flex-col gap-10">
      <SignUp />
    </div>
  );
}
