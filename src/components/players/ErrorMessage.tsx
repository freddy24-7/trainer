import React from 'react';

import { ErrorMessageProps } from '@/type-list/types';

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="text-red-500">{message}</div>
);

export default ErrorMessage;
