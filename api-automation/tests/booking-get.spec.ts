import { BookerClient } from '../clients/BookerClient';
import { BookingIdListSchema, BookingSchema } from '../schemas/booking.schema';
import { createBookingPayload } from '../data/booking.data';
import { getAuthenticatedClient } from '../utils/auth.helper';

describe('GET /booking', () => {
  let client: BookerClient;

  beforeAll(async () => {
    client = await getAuthenticatedClient();
  });

  it('should return a list of booking ids', async () => {
    const res = await client.getAllBookings();

    expect(res.status).toBe(200);
    BookingIdListSchema.parse(res.body);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /booking/:id', () => {
  let client: BookerClient;
  let createdBookingId: number;

  beforeAll(async () => {
    client = await getAuthenticatedClient();
    const res = await client.createBooking(createBookingPayload());
    createdBookingId = res.body.bookingid;
  });

  it('should return booking details for a valid id', async () => {
    const res = await client.getBookingById(createdBookingId);

    expect(res.status).toBe(200);
    BookingSchema.parse(res.body);
    expect(res.body.firstname).toBe('John');
    expect(res.body.lastname).toBe('Doe');
  });

  it('should return 404 for a non-existent booking id', async () => {
    const res = await client.getBookingById(999999999);

    expect(res.status).toBe(404);
  });
});
