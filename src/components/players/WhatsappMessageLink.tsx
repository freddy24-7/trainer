import React from 'react';

import { WhatsappMessageLinkProps } from '@/types/types';

const WhatsappMessageLink: React.FC<WhatsappMessageLinkProps> = ({
  whatsappNumber,
  message,
  onClick,
  className,
}) => {
  const formattedWhatsappNumber = whatsappNumber.replace(/\D/g, '');
  const href = `https://wa.me/${formattedWhatsappNumber}/?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className || 'mt-4 bg-green-500 text-white p-2 rounded-lg inline-block'
      }
      onClick={onClick}
    >
      Send WhatsApp Message to Player
    </a>
  );
};

export default WhatsappMessageLink;
