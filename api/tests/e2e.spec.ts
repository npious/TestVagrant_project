import { BookerClient } from '../clients/BookerClient';
import { BookingSchema } from '../schemas/booking.schema';
import { createBookingPayload, updatedBookingPayload } from '../data/booking.data';

// E2E test: the full lifecycle is a single test — each step depends on the previous.
// Splitting into multiple it() blocks would create false independence (step 2 needs
// the bookingId from step 1). One test = one story.

describe('E2E: Create → Update → Verify → Delete', () => {
  let client: BookerClient;

  beforeAll(async () => {
    client = new BookerClient();
    await client.authenticate({
      username: process.env.BOOKER_USERNAME!,
      password: process.env.BOOKER_PASSWORD!,
    });
  });

  it('should complete the full booking lifecycle', async () => {
    // Step 1: Create a booking
    const createPayload = createBookingPayload();
    const createRes = await client.createBooking(createPayload);
    expect(createRes.status).toBe(200);
    expect(createRes.body.bookingid).toBeDefined();

    const bookingId: number = createRes.body.bookingid;
    expect(createRes.body.booking.firstname).toBe(createPayload.firstname);

    // Step 2: Update the booking
    const updatePayload = updatedBookingPayload();
    const updateRes = await client.updateBooking(bookingId, updatePayload);
    expect(updateRes.status).toBe(200);
    BookingSchema.parse(updateRes.body);
    expect(updateRes.body.firstname).toBe(updatePayload.firstname);
    expect(updateRes.body.totalprice).toBe(updatePayload.totalprice);

    // Step 3: Verify the update persisted via GET
    const getRes = await client.getBookingById(bookingId);
    expect(getRes.status).toBe(200);
    expect(getRes.body.firstname).toBe(updatePayload.firstname);
    expect(getRes.body.lastname).toBe(updatePayload.lastname);
    expect(getRes.body.totalprice).toBe(updatePayload.totalprice);

    // Step 4: Delete the booking
    const deleteRes = await client.deleteBooking(bookingId);
    expect(deleteRes.status).toBe(201);

    // Step 5: Confirm it no longer exists
    const confirmRes = await client.getBookingById(bookingId);
    expect(confirmRes.status).toBe(404);
  });
});
