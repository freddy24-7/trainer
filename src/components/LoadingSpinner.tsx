import React from 'react';
import { Spinner } from '@nextui-org/spinner';

type LoadingSpinnerProps = {
  label?: string;
  color?: 'primary' | 'success' | 'danger' | 'warning';
  labelColor?: 'primary' | 'success' | 'danger' | 'warning';
};

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
