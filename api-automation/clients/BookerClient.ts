import supertest, { Response } from 'supertest';
import {
  AuthPayload,
  CreateBookingPayload,
  UpdateBookingPayload,
} from '../types/booking.types';

const request = supertest(process.env.BOOKER_BASE_URL!);

export class BookerClient {
  private token: string | null = null;

  // ─── Auth ────────────────────────────────────────────────────────────────

  async createToken(payload: AuthPayload): Promise<Response> {
    return request
      .post('/auth')
      .set('Content-Type', 'application/json')
      .send(payload);
  }

  async authenticate(payload: AuthPayload): Promise<void> {
    const res = await this.createToken(payload);
    this.token = res.body.token;
  }

  // ─── GET ─────────────────────────────────────────────────────────────────

  async getAllBookings(): Promise<Response> {
    return request
      .get('/booking')
      .set('Accept', 'application/json');
  }

  async getBookingById(id: number): Promise<Response> {
    return request
      .get(`/booking/${id}`)
      .set('Accept', 'application/json');
  }

  // ─── CREATE ──────────────────────────────────────────────────────────────

  async createBooking(payload: CreateBookingPayload): Promise<Response> {
    return request
      .post('/booking')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(payload);
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────

  async updateBooking(id: number, payload: UpdateBookingPayload): Promise<Response> {
    return request
      .put(`/booking/${id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Cookie', `token=${this.requireToken()}`)
      .send(payload);
  }

  async partialUpdateBooking(id: number, payload: Partial<UpdateBookingPayload>): Promise<Response> {
    return request
      .patch(`/booking/${id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Cookie', `token=${this.requireToken()}`)
      .send(payload);
  }

  // ─── DELETE ──────────────────────────────────────────────────────────────

  async deleteBooking(id: number): Promise<Response> {
    return request
      .delete(`/booking/${id}`)
      .set('Cookie', `token=${this.requireToken()}`);
  }

  async deleteBookingWithoutAuth(id: number): Promise<Response> {
    return request.delete(`/booking/${id}`);
  }

  // ─── Private ─────────────────────────────────────────────────────────────

  private requireToken(): string {
    if (!this.token) throw new Error('Client is not authenticated. Call authenticate() first.');
    return this.token;
  }
}
