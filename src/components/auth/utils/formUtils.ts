
// Form utility functions for the registration process

/**
 * Formats a phone number to US format: (xxx) xxx-xxxx
 */
export const formatPhoneNumber = (value: string): string => {
  if (!value) return value;
  
  const phoneNumber = value.replace(/\D/g, '');
  
  const truncated = phoneNumber.substring(0, 10);
  
  if (truncated.length < 4) {
    return truncated;
  } else if (truncated.length < 7) {
    return `(${truncated.substring(0, 3)}) ${truncated.substring(3)}`;
  }
  return `(${truncated.substring(0, 3)}) ${truncated.substring(3, 6)}-${truncated.substring(6)}`;
};

/**
 * Validates MC number format
 */
export const isValidMCNumber = (value: string): boolean => {
  return /^MC-\d{5,8}$/.test(value) || /^\d{5,8}$/.test(value);
};

/**
 * Validates DOT number format
 */
export const isValidDOTNumber = (value: string): boolean => {
  return /^\d{5,8}$/.test(value);
};

/**
 * Handle phone number input change
 */
export const handlePhoneChange = (
  e: React.ChangeEvent<HTMLInputElement>, 
  onChange: (...event: any[]) => void
) => {
  const formattedValue = formatPhoneNumber(e.target.value);
  onChange(formattedValue);
};
