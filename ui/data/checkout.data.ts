export const CheckoutData = {
  VALID: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '10001',
  },
  MISSING_FIRST_NAME: {
    firstName: '',
    lastName: 'Doe',
    postalCode: '10001',
  },
  MISSING_LAST_NAME: {
    firstName: 'John',
    lastName: '',
    postalCode: '10001',
  },
  MISSING_POSTAL_CODE: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '',
  },
} as const;
