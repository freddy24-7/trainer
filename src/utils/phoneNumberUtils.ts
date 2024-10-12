export function formatWhatsappNumber(number: string): string | null {
  const isValid = /^06\d{8}$/.test(number);
  if (!isValid) {
    return null;
  }
  return number.replace(/^06/, '+316');
}

export function formatWhatsappNumberToDisplay(number: string): string {
  if (number.startsWith('+316')) {
    return number.replace('+316', '06');
  }
  return number;
}

export function handleWhatsAppClick(delay: number = 500): void {
  setTimeout(() => {
    window.location.reload();
  }, delay);
}
