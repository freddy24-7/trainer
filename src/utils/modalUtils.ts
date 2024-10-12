import React from 'react';

export const setupModal = ({
  setModalTitle,
  setModalBody,
  setConfirmAction,
  setIsModalOpen,
  title,
  body,
  confirmAction,
}: {
  setModalTitle: (title: string) => void;
  setModalBody: (body: React.ReactNode) => void;
  setConfirmAction: (action: () => void) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  title: string;
  body: React.ReactNode;
  confirmAction: () => void;
}) => {
  setModalTitle(title);
  setModalBody(body);
  setConfirmAction(() => confirmAction);
  setIsModalOpen(true);
};
