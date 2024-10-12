import { useState } from 'react';
import { formatWhatsappNumberToDisplay } from '@/utils/phoneNumberUtils';

export function usePlayerFormState(initialData: {
  username: string;
  password: string;
  whatsappNumber: string;
}) {
  const [username, setUsername] = useState(initialData?.username || '');
  const [password, setPassword] = useState(initialData?.password || '');
  const [whatsappNumber, setWhatsappNumber] = useState(
    formatWhatsappNumberToDisplay(initialData?.whatsappNumber || '')
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
