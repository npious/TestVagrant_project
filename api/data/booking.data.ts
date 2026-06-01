import { CreateBookingPayload } from '../types/booking.types';

export function createBookingPayload(overrides: Partial<CreateBookingPayload> = {}): CreateBookingPayload {
  return {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2025-01-01',
      checkout: '2025-01-07',
    },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

export function updatedBookingPayload(overrides: Partial<CreateBookingPayload> = {}): CreateBookingPayload {
  return {
    firstname: 'Jane',
    lastname: 'Smith',
    totalprice: 300,
    depositpaid: false,
    bookingdates: {
      checkin: '2025-03-01',
      checkout: '2025-03-10',
    },
    additionalneeds: 'Lunch',
    ...overrides,
  };
}
