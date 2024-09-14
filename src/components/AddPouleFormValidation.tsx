// This component is a form that prepares the server action and validates the form fields.
'use client';

import React, { useRef, useEffect, useState } from 'react';
import type { ZodIssue } from 'zod';
import { toast } from 'react-toastify';

type Props = {
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] } | void>;
  onPouleAdded?: () => void;
};

function AddPouleFormValidation({ action, onPouleAdded }: Props) {
  const [formErrors, setFormErrors] = useState<ZodIssue[]>([]);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [opponents, setOpponents] = useState<string[]>([]);
  const [opponentName, setOpponentName] = useState('');

  function isErrorResponse(
    result: void | { errors: ZodIssue[] }
  ): result is { errors: ZodIssue[] } {
    return result !== undefined && 'errors' in result;
  }

  useEffect(() => {
    if (isSubmitted && formErrors.length === 0) {
      formRef.current?.reset();
      setIsSubmitted(false);
      setOpponents([]);
      if (onPouleAdded) onPouleAdded();
    }
  }, [formErrors, isSubmitted, onPouleAdded]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    setFormErrors([]);

    const formData = new FormData(event.currentTarget);

    opponents.forEach((opponent) => {
      formData.append('opponents', opponent);
    });

    console.log('FormData before submission:', Array.from(formData.entries()));

    const result = await action(null, formData);

    if (isErrorResponse(result)) {
      setFormErrors(result.errors);
      toast.error('Failed to add poule. Please check your inputs.');
      console.error('Submission errors:', result.errors);
    } else {
      toast.success('Poule added successfully!');
      console.log('Redirect occurred, no errors returned.');
    }
  };

  const addOpponent = () => {
    if (opponentName.trim()) {
      console.log('Adding opponent:', opponentName);
      setOpponents((prev) => [...prev, opponentName.trim()]);
      setOpponentName('');
    } else {
      console.log('Attempted to add empty opponent name');
    }
  };

  const removeOpponent = (index: number) => {
    setOpponents((prev) => prev.filter((_, i) => i !== index));
    console.log('Removed opponent at index:', index);
  };

  const findErrors = (fieldName: string) =>
    formErrors
      .filter((item) => item.path.includes(fieldName))
      .map((item) => item.message);

  const pouleNameErrors = findErrors('pouleName');
  const mainTeamNameErrors = findErrors('mainTeamName');
  const opponentsErrors = findErrors('opponents');

  return (
    <form
      ref={formRef}
      onSubmit={handleFormSubmit}
      method="POST"
      className="space-y-4 max-w-md mx-auto mt-10 p-6 bg-zinc-300 text-black shadow-md rounded dark:bg-black dark:text-white"
    >
      <h3 className="text-lg font-semibold mt-8 mb-4">Poule Management</h3>
      <div>
        <label className="block mb-2">
          Poule Name:
          <input
            type="text"
            name="pouleName"
            required
            className="input-class w-full p-2 border rounded mt-1 bg-white text-black dark:bg-white dark:text-black"
          />
        </label>
        <ErrorMessages errors={pouleNameErrors} />
      </div>
      <div>
        <label className="block mb-2">
          Main Team Name:
          <input
            type="text"
            name="mainTeamName"
            required
            className="input-class w-full p-2 border rounded mt-1 bg-white text-black dark:bg-white dark:text-black"
          />
        </label>
        <ErrorMessages errors={mainTeamNameErrors} />
      </div>
      <div className="mb-4">
        <label className="block mb-2">
          Opponent Team Name:
          <input
            value={opponentName}
            onChange={(e) => setOpponentName(e.target.value)}
            placeholder="Enter opponent name"
            className="input-class w-full p-2 border rounded mt-1 bg-white text-black dark:bg-white dark:text-black"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addOpponent();
              }
            }}
          />
        </label>
        <button
          type="button"
          onClick={addOpponent}
          className="mt-2 bg-blue-500 text-white p-1 rounded"
        >
          Add Opponent
        </button>
        <ul className="mt-4">
          {opponents.map((opponent, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{opponent}</span>
              <button
                type="button"
                onClick={() => removeOpponent(index)}
                className="text-red-500 ml-2"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <ErrorMessages errors={opponentsErrors} />
      </div>
      <button
        type="submit"
        className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800 dark:bg-black dark:text-white"
      >
        Add Poule
      </button>
      {isSubmitted && formErrors.length === 0 && (
        <p className="text-green-600 mt-2">Poule added successfully!</p>
      )}
    </form>
  );
}

const ErrorMessages = ({ errors }: { errors: string[] }) => {
  if (errors.length === 0) return null;

  return <div className="text-red-600 mt-2">{errors.join(', ')}</div>;
};

export { AddPouleFormValidation, ErrorMessages };
