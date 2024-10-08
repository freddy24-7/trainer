import React from 'react';

import { ErrorMessageProps } from '@/types/types';

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="text-red-500">{message}</div>
);

export default ErrorMessage;
