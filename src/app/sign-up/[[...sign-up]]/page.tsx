// This page is responsible for rendering the sign-up form

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center flex-col gap-10">
      <SignUp />
    </div>
  );
}
