'use client';

import React from 'react';
import { ZodIssue } from 'zod';

import { useAddPouleForm } from '@/hooks/useAddPouleForm';

import PouleForm from './PouleForm';
import ToggleFormButton from './ToggleFormButton';

interface Props {
  action: (params: FormData) => Promise<{ errors: ZodIssue[] } | void>;
}

function AddPouleFormValidation({ action }: Props): React.ReactElement | null {
  const {
    opponents,
    showForm,
    toggleForm,
    methods,
    addOpponent,
    removeOpponent,
    onSubmit,
  } = useAddPouleForm({ action });

  return (
    <div className="mt-4">
      <ToggleFormButton showForm={showForm} toggleForm={toggleForm} />
      {showForm && (
        <PouleForm
          methods={methods}
          opponents={opponents}
          addOpponent={addOpponent}
          removeOpponent={removeOpponent}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}

export { AddPouleFormValidation };
