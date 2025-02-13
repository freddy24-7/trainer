import React from 'react';

jest.mock('@heroui/react', () => ({
  Modal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-modal">{children}</div>
  ),
  ModalContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ModalHeader: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  ModalBody: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ModalFooter: ({ children }: { children: React.ReactNode }) => (
    <footer>{children}</footer>
  ),
}));

jest.mock('../src/components/Button', () => {
  const MockButton = ({
    children,
    onPress,
  }: {
    children: React.ReactNode;
    onPress: () => void;
  }) => <button onClick={onPress}>{children}</button>;

  MockButton.displayName = 'MockButton';

  return MockButton;
});
