export interface AuthPayload {
  username: string;
  password: string;
}

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface CreateBookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export type UpdateBookingPayload = CreateBookingPayload;

export interface BookingResponse {
  bookingid: number;
  booking: CreateBookingPayload;
}

export interface BookingIdItem {
  bookingid: number;
}
