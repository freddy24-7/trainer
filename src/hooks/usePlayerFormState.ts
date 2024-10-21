import React, { useState } from 'react';

import { handleFormatWhatsappNumberToDisplay } from '@/utils/phoneNumberUtils';

export function usePlayerFormState(initialData: {
  username: string;
  password: string;
  whatsappNumber: string;
}): {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  whatsappNumber: string;
  setWhatsappNumber: React.Dispatch<React.SetStateAction<string>>;
} {
  const [username, setUsername] = useState(initialData?.username || '');
  const [password, setPassword] = useState(initialData?.password || '');
  const [whatsappNumber, setWhatsappNumber] = useState(
    handleFormatWhatsappNumberToDisplay(initialData?.whatsappNumber || '')
  );

  return {
    username,
    setUsername,
    password,
    setPassword,
    whatsappNumber,
    setWhatsappNumber,
  };
}
