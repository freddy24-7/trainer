import React from 'react';

import { WhatsappNumberInputProps } from '@/types/types';

const WhatsappNumberInput: React.FC<WhatsappNumberInputProps> = ({
  whatsappNumber,
  setWhatsappNumber,
}) => (
  <div>
    <label className="block text-brandcolor">WhatsApp Number</label>
    <input
      type="tel"
      value={whatsappNumber}
      onChange={(e) => setWhatsappNumber(e.target.value)}
      required={true}
      placeholder="06XXXXXXXX"
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
    />
  </div>
);

export default WhatsappNumberInput;
