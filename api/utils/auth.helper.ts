import { BookerClient } from '../clients/BookerClient';

let cachedClient: BookerClient | null = null;

export async function getAuthenticatedClient(): Promise<BookerClient> {
  if (cachedClient) return cachedClient;

  const client = new BookerClient();
  await client.authenticate({
    username: process.env.BOOKER_USERNAME!,
    password: process.env.BOOKER_PASSWORD!,
  });

  cachedClient = client;
  return cachedClient;
}

export function resetCachedClient(): void {
  cachedClient = null;
}
