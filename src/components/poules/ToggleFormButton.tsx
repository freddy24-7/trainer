import React from 'react';

import { Button } from '@/components/ui/button';
import { ToggleFormButtonProps } from '@/types/types';

const ToggleFormButton: React.FC<ToggleFormButtonProps> = ({
  showForm,
  toggleForm,
}) => (
  <Button
    onClick={toggleForm}
    className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    {showForm ? 'Cancel' : 'Add Another Poule'}
  </Button>
);

export default ToggleFormButton;
