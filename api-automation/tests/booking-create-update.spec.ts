import { BookerClient } from '../clients/BookerClient';
import { BookingResponseSchema, BookingSchema } from '../schemas/booking.schema';
import { createBookingPayload, updatedBookingPayload } from '../data/booking.data';
import { UpdateBookingPayload } from '../types/booking.types';
import { getAuthenticatedClient } from '../utils/auth.helper';

describe('Booking Management using POST', () => {
  let client: BookerClient;

  beforeAll(async () => {
    client = await getAuthenticatedClient();
  });

  it('should create a booking and return booking id with details', async () => {
    const payload = createBookingPayload();
    const res = await client.createBooking(payload);
    expect(res.status).toBe(200);
    BookingResponseSchema.parse(res.body);
    expect(res.body.bookingid).toBeDefined();
    expect(res.body.booking.firstname).toBe(payload.firstname);
    expect(res.body.booking.totalprice).toBe(payload.totalprice);
  });

  it('should create a booking without optional additionalneeds field', async () => {
    const payload = createBookingPayload({ additionalneeds: undefined });
    const res = await client.createBooking(payload);
    expect(res.status).toBe(200);
    expect(res.body.bookingid).toBeDefined();
  });
});

describe('Booking Management using PUT', () => {
  let client: BookerClient;
  let bookingId: number;

  beforeAll(async () => {
    client = await getAuthenticatedClient();
    const res = await client.createBooking(createBookingPayload());
    bookingId = res.body.bookingid;
  });

  it('should fully update a booking with valid auth token', async () => {
    const payload = updatedBookingPayload();
    const res = await client.updateBooking(bookingId, payload);

    expect(res.status).toBe(200);
    BookingSchema.parse(res.body);
    expect(res.body.firstname).toBe(payload.firstname);
    expect(res.body.lastname).toBe(payload.lastname);
    expect(res.body.totalprice).toBe(payload.totalprice);
  });

  it('should return 400 when updating with empty or wrong payloads', async () => {
    const invalidPayloads: Partial<UpdateBookingPayload>[] = [
      {},
      { firstname: 'Jane' },
      { totalprice: 'invalid' as unknown as number },
    ];

    for (const payload of invalidPayloads) {
      const res = await client.updateBooking(bookingId, payload as UpdateBookingPayload);
      expect(res.status).toBe(400);
    }
  });
});
