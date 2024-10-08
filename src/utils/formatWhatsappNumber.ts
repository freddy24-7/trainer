import { toast } from 'react-toastify';

export const formatWhatsappNumber = (number: string): string | null => {
  const isValid = /^06\d{8}$/.test(number);
  if (!isValid) {
    toast.error(
      "WhatsApp number must start with '06' and be exactly 10 digits long."
    );
    return null;
  }
  return number.replace(/^06/, '+316');
};
