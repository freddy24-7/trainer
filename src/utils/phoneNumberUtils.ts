export const formatToDisplay = (number: string): string => {
  if (number.startsWith('+316')) {
    return number.replace('+316', '06');
  }
  return number;
};

export const formatForSaving = (number: string): string => {
  if (number.startsWith('06')) {
    return number.replace('06', '+316');
  }
  return number;
};
