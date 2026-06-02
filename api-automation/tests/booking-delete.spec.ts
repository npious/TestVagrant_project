import { BookerClient } from '../clients/BookerClient';
import { createBookingPayload } from '../data/booking.data';
import { getAuthenticatedClient } from '../utils/auth.helper';

describe('DELETE /booking/:id', () => {
  let client: BookerClient;

  beforeAll(async () => {
    client = await getAuthenticatedClient();
  });

  it('should delete a booking with valid auth token', async () => {
    const createRes = await client.createBooking(createBookingPayload());
    const bookingId = createRes.body.bookingid;
    const deleteRes = await client.deleteBooking(bookingId);
    expect(deleteRes.status).toBe(201);
    const getRes = await client.getBookingById(bookingId);
    expect(getRes.status).toBe(404);
  });

  it('should return 403 when deleting without auth token', async () => {
    const createRes = await client.createBooking(createBookingPayload());
    const bookingId = createRes.body.bookingid;
    const res = await client.deleteBookingWithoutAuth(bookingId);
    expect(res.status).toBe(403);
  });
});
