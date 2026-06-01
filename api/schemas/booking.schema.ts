import { z } from 'zod';

export const BookingDatesSchema = z.object({
  checkin: z.string(),
  checkout: z.string(),
});

export const BookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: BookingDatesSchema,
  additionalneeds: z.string().optional(),
});

export const BookingResponseSchema = z.object({
  bookingid: z.number(),
  booking: BookingSchema,
});

export const BookingIdItemSchema = z.object({
  bookingid: z.number(),
});

export const BookingIdListSchema = z.array(BookingIdItemSchema);

export const AuthTokenSchema = z.object({
  token: z.string(),
});
