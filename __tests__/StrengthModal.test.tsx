import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';

import { StrengthModalProps } from '@/types/match-types';

import StrengthModal from '../src/components/helpers/matchHelpers/StrengthModal';

jest.mock('../src/components/Button', () => {
  return function MockButton({ children, onPress }: any) {
    return <button onClick={onPress}>{children}</button>;
  };
});

jest.mock('@heroui/react', () => {
  const React = require('react');
  return {
    Modal: ({ isOpen, onOpenChange, children }: any) =>
      isOpen ? (
        <div data-testid="mock-modal">
          {React.Children.map(children, (child: React.ReactNode) =>
            React.isValidElement(child)
              ? React.cloneElement(child, {
                  onClose: () => onOpenChange(false),
                })
              : child
          )}
        </div>
      ) : null,
    ModalContent: ({ children, onClose }: any) =>
      typeof children === 'function' ? (
        <div>{children(onClose)}</div>
      ) : (
        <div>{children}</div>
      ),
    ModalHeader: ({ children }: any) => <h2>{children}</h2>,
    ModalBody: ({ children }: any) => <div>{children}</div>,
    ModalFooter: ({ children }: any) => <footer>{children}</footer>,
  };
});

describe('StrengthModal', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnConfirmOpen = jest.fn();
  const mockOnConfirmChange = jest.fn();
  const mockSetSelectedStrength = jest.fn();
  const mockHandleConfirmStrength = jest.fn();

  const renderComponent = (props?: Partial<StrengthModalProps>) =>
    render(
      <StrengthModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        isConfirmOpen={false}
        onConfirmOpen={mockOnConfirmOpen}
        onConfirmChange={mockOnConfirmChange}
        selectedStrength={null}
        setSelectedStrength={mockSetSelectedStrength}
        handleConfirmStrength={mockHandleConfirmStrength}
        {...props}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('opens modal and displays strength selection options', () => {
    renderComponent();
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    expect(screen.getByText('Sterker')).toBeInTheDocument();
    expect(screen.getByText('Gelijkwaardig')).toBeInTheDocument();
    expect(screen.getByText('Zwakker')).toBeInTheDocument();
  });

  it('calls setSelectedStrength when a strength option is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Sterker'));
    expect(mockSetSelectedStrength).toHaveBeenCalledWith('STRONGER');

    fireEvent.click(screen.getByText('Gelijkwaardig'));
    expect(mockSetSelectedStrength).toHaveBeenCalledWith('SIMILAR');

    fireEvent.click(screen.getByText('Zwakker'));
    expect(mockSetSelectedStrength).toHaveBeenCalledWith('WEAKER');
  });

  it('moves to confirmation modal when Confirm is clicked and a strength is selected', () => {
    renderComponent({ selectedStrength: 'STRONGER' });
    fireEvent.click(screen.getByText('Confirm'));
    expect(mockOnConfirmOpen).toHaveBeenCalled();
  });

  it('closes modal when cancel is clicked in selection modal', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('confirms selection in confirmation modal', () => {
    renderComponent({ isConfirmOpen: true, selectedStrength: 'STRONGER' });
    fireEvent.click(screen.getByText('Bevestigen'));
    expect(mockHandleConfirmStrength).toHaveBeenCalled();
    expect(mockOnConfirmChange).toHaveBeenCalledWith(false);
  });

  it('cancels confirmation modal', () => {
    renderComponent({ isConfirmOpen: true, selectedStrength: 'SIMILAR' });
    fireEvent.click(screen.getByText('Annuleren'));
    expect(mockOnConfirmChange).toHaveBeenCalledWith(false);
  });
});
