import React, { useEffect } from 'react';
import { FaBan } from 'react-icons/fa';
import { toast } from 'react-toastify';

import {
  futureTrainingError,
  futureDateWarningText,
} from '@/strings/clientStrings';
import { FutureDateWarningProps } from '@/types/shared-types';

const FutureDateWarning: React.FC<FutureDateWarningProps> = ({
  isFutureDate,
  showToast = false,
}) => {
  useEffect(() => {
    if (showToast && isFutureDate) {
      toast.error(futureTrainingError, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [isFutureDate, showToast]);

  if (!isFutureDate) return null;

  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 animate-bounce shadow-lg">
      <FaBan size={20} />
      <span>{futureDateWarningText}</span>
    </div>
  );
};

export default FutureDateWarning;
