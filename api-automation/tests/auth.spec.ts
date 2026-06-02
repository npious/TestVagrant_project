import { BookerClient } from '../clients/BookerClient';
import { AuthTokenSchema } from '../schemas/booking.schema';

describe('Authentication using POST method', () => {
  let client: BookerClient;

  beforeEach(() => {
    client = new BookerClient();
  });

  it('should return a token with valid credentials', async () => {
    const res = await client.createToken({
      username: process.env.BOOKER_USERNAME!,
      password: process.env.BOOKER_PASSWORD!,
    });

    expect(res.status).toBe(200);
    AuthTokenSchema.parse(res.body);
    expect(res.body.token).toBeTruthy();
  });

  it('should return bad credentials message with invalid password', async () => {
    const res = await client.createToken({
      username: process.env.BOOKER_USERNAME!,
      password: 'wrongpassword',
    });

    expect(res.status).toBe(200);
    expect(res.body.reason).toBe('Bad credentials');
  });

  it('should return bad credentials with invalid username', async () => {
    const res = await client.createToken({
      username: 'invaliduser',
      password: process.env.BOOKER_PASSWORD!,
    });

    expect(res.status).toBe(200);
    expect(res.body.reason).toBe('Bad credentials');
  });
});
