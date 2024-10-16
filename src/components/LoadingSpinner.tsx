import React from 'react';
import { Spinner } from '@nextui-org/spinner';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center mt-10">
      <Spinner label="Loading Chat" color="primary" labelColor="primary" />
    </div>
  );
};

export default LoadingSpinner;
