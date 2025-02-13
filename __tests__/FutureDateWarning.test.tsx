import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { toast } from 'react-toastify';

import { FutureDateWarningProps } from '@/types/shared-types';

import FutureDateWarning from '../src/components/FutureDateWarning';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('FutureDateWarning', () => {
  const futureWarningText = '🚫 Toekomstige data zijn niet toegestaan!';

  const renderComponent = (props?: Partial<FutureDateWarningProps>) =>
    render(
      <FutureDateWarning isFutureDate={true} showToast={false} {...props} />
    );

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders the warning message when isFutureDate is true', () => {
    renderComponent();
    expect(screen.getByText(futureWarningText)).toBeInTheDocument();
  });

  it('does not render anything when isFutureDate is false', () => {
    const { container } = renderComponent({ isFutureDate: false });
    expect(container.firstChild).toBeNull();
  });

  it('triggers a toast notification when showToast is true', () => {
    renderComponent({ showToast: true });
    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining(
        '🚫 Je kunt geen trainingssessie in de toekomst plannen.'
      ),
      expect.any(Object)
    );
  });

  it('does not trigger a toast when showToast is false', () => {
    renderComponent({ showToast: false });
    expect(toast.error).not.toHaveBeenCalled();
  });
});
