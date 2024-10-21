export const handleSubmissionState = (
  setSubmitting: (submitting: boolean) => void,
  onStart?: () => void,
  onAbort?: () => void
): (() => void) => {
  setSubmitting(true);
  if (onStart) {
    onStart();
  }
  return () => {
    setSubmitting(false);
    if (onAbort) {
      onAbort();
    }
  };
};
