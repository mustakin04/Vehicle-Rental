import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    const { vehicle_id, rent_start_date, rent_end_date } = req.body;

    const customer_id =
      requester.role === "customer"
        ? requester.id
        : req.body.customer_id || requester.id;

    const booking = await bookingsService.createBooking(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date
    );

    res.status(201).json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;

    if (requester.role === "admin") {
      const bookings = await bookingsService.getBookingsForAdmin();
      return res.json(bookings);
    }

    const bookings = await bookingsService.getBookingsForCustomer(requester.id);
    return res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;

    // FIX: Validate bookingId is string
    const bookingId = req.params.bookingId;
    if (!bookingId || typeof bookingId !== "string") {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    if (requester.role === "customer") {
      const result = await bookingsService.cancelBooking(
        bookingId,
        requester.id,
        requester.role
      );
      return res.json(result);
    }

    if (requester.role === "admin") {
      const result = await bookingsService.markReturned(bookingId);
      return res.json(result);
    }

    return res.status(403).json({ message: "Forbidden" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const bookingsControllers = {
  createBooking,
  getBookings,
  updateBooking,
};
