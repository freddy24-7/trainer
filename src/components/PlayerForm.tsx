import React from 'react';
import { PlayerFormProps } from '@/lib/types';
import { usePlayerFormState } from '@/hooks/usePlayerFormState';

function PlayerForm({
  initialData,
  onSubmit,
  onSubmissionStart,
  submitButtonText,
}: PlayerFormProps) {
  const {
    username,
    setUsername,
    password,
    setPassword,
    whatsappNumber,
    setWhatsappNumber,
  } = usePlayerFormState(
    initialData ?? { username: '', password: '', whatsappNumber: '' }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmissionStart();

    try {
      await onSubmit({ username, password, whatsappNumber });
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-brandcolor">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-brandcolor">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="whatsappNumber" className="block text-brandcolor">
          WhatsApp Number
        </label>
        <input
          id="whatsappNumber"
          type="tel"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          required
          placeholder="06XXXXXXXX"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring"
      >
        {submitButtonText}
      </button>
    </form>
  );
}

export default PlayerForm;
