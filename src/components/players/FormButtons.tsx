import React from 'react';

import { FormButtonsProps } from '@/types/types';

const FormButtons: React.FC<FormButtonsProps> = ({
  submitButtonText,
  onAbort,
}) => (
  <div className="flex justify-between">
    <button
      type="submit"
      className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring"
    >
      {submitButtonText}
    </button>

    {onAbort && (
      <button
        type="button"
        className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring"
        onClick={onAbort}
      >
        Cancel
      </button>
    )}
  </div>
);

export default FormButtons;
