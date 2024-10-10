import React from 'react';

import { SuccessMessageProps } from '@/type-list/types';

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => (
  <p className="text-green-600">{message}</p>
);

export default SuccessMessage;
