// This component is for zod validation of a player submission in server actions.

'use client';

import { useFormState } from 'react-dom';
import React, { useRef, useEffect, useState } from 'react';
import type { ZodIssue } from 'zod';

type Props = {
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
};

function AddPlayerFormValidation({ action }: Props) {
  const [state, formAction] = useFormState(action, { errors: [] });
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const usernameErrors = findErrors('username', state.errors);
  const passwordErrors = findErrors('password', state.errors);

  // This useEffect hook is used only to clear the form after submission
  useEffect(() => {
    if (isSubmitted && state.errors.length === 0) {
      formRef.current?.reset();
      setIsSubmitted(false);
    }
  }, [state.errors, isSubmitted]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    formAction(new FormData(event.currentTarget)); // Trigger the form action
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleFormSubmit}
      method="POST"
      className="space-y-4 max-w-md mx-auto mt-10 p-6 bg-zinc-300 text-black shadow-md rounded dark:bg-black dark:text-white"
    >
      <h3 className="text-lg font-semibold mt-8 mb-4">Player Management</h3>
      <div>
        <label className="block mb-2">
          Username:
          <input
            type="text"
            name="username"
            required
            className="input-class w-full p-2 border rounded mt-1 bg-white text-black dark:bg-white dark:text-black"
          />
        </label>
        <ErrorMessages errors={usernameErrors} />
      </div>
      <div>
        <label className="block mb-2">
          Password:
          <input
            type="password"
            name="password"
            required
            className="input-class w-full p-2 border rounded mt-1 bg-white text-black dark:bg-white dark:text-black"
          />
        </label>
        <ErrorMessages errors={passwordErrors} />
      </div>
      <button
        type="submit"
        className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800 dark:bg-black dark:text-white"
      >
        Add Player
      </button>
      {isSubmitted && state.errors.length === 0 && (
        <p className="text-green-600 mt-2">Player added successfully!</p>
      )}
    </form>
  );
}

const ErrorMessages = ({ errors }: { errors: string[] }) => {
  if (errors.length === 0) return null;

  const text = errors.join(', ');

  return <div className="text-red-600 mt-2">{text}</div>;
};

const findErrors = (fieldName: string, errors: ZodIssue[]) => {
  return errors
    .filter((item) => item.path.includes(fieldName))
    .map((item) => item.message);
};

export { AddPlayerFormValidation, ErrorMessages, findErrors };
