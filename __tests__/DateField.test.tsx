import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import DateField from '@/components/DateField';
import { startDateAfterEndDateError } from '@/strings/clientStrings';

jest.mock('@heroui/react', () => ({
  DatePicker: ({ label, value, onChange, isInvalid, errorMessage }: any) => (
    <div data-testid="date-picker">
      <label htmlFor={`mock-date-input-${label}`}>{label}</label>
      <input
        id={`mock-date-input-${label}`}
        data-testid={`date-input-${label}`}
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
      {isInvalid && (
        <p data-testid={`error-message-${label}`} className="error-message">
          {errorMessage}
        </p>
      )}
    </div>
  ),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('DateField Component', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    cleanup();
  });

  it('renders the date field with the correct label', () => {
    render(
      <Wrapper>
        <DateField name="startDate" label="Startdatum" />
      </Wrapper>
    );
    expect(screen.getByLabelText(/Startdatum/i)).toBeInTheDocument();
  });

  it('shows an error when the start date is after the end date', async () => {
    const TestForm = () => {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <DateField name="startDate" label="Startdatum" />
          <DateField name="endDate" label="Einddatum" />
          <button
            type="button"
            onClick={async () => {
              await methods.trigger();
            }}
          >
            Validate
          </button>
        </FormProvider>
      );
    };

    render(<TestForm />);

    const startDateInput = screen.getByTestId('date-input-Startdatum');
    const endDateInput = screen.getByTestId('date-input-Einddatum');

    fireEvent.change(startDateInput, { target: { value: '2023-12-10' } });
    fireEvent.blur(startDateInput);

    fireEvent.change(endDateInput, { target: { value: '2023-12-05' } });
    fireEvent.blur(endDateInput);

    fireEvent.click(screen.getByText('Validate'));

    expect(
      await screen.findByTestId('error-message-Startdatum')
    ).toHaveTextContent(startDateAfterEndDateError);
  });

  it('does not show an error for a valid date range', async () => {
    const TestForm = () => {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <DateField name="startDate" label="Startdatum" />
          <DateField name="endDate" label="Einddatum" />
          <button
            type="button"
            onClick={async () => {
              await methods.trigger();
            }}
          >
            Validate
          </button>
        </FormProvider>
      );
    };

    render(<TestForm />);

    const startDateInput = screen.getByTestId('date-input-Startdatum');
    const endDateInput = screen.getByTestId('date-input-Einddatum');

    fireEvent.change(startDateInput, { target: { value: '2023-12-05' } });
    fireEvent.blur(startDateInput);

    fireEvent.change(endDateInput, { target: { value: '2023-12-10' } });
    fireEvent.blur(endDateInput);

    fireEvent.click(screen.getByText('Validate'));

    expect(
      screen.queryByTestId('error-message-Startdatum')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('error-message-Einddatum')
    ).not.toBeInTheDocument();
  });
});
