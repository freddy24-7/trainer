import { Spinner } from '@heroui/spinner';
import React from 'react';

import { LoadingSpinnerProps } from '@/types/shared-types';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading...',
  color = 'primary',
  labelColor = 'primary',
}) => {
  return (
    <div className="flex justify-center mt-10">
      <Spinner label={label} color={color} labelColor={labelColor} />
    </div>
  );
};

export default LoadingSpinner;
