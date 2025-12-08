import { pool } from "../../config/db";
import { calculateTotalPrice } from "../../utils/helpers";
import { vehiclesService } from "../vehicles/vehicles.service";

const createBooking = async (customer_id: string, vehicle_id: string, rent_start_date: string, rent_end_date: string) => {
  const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id]);
  if (!vehicle.rows[0]) throw new Error("Vehicle not found");
  if (vehicle.rows[0].availability_status !== "available") throw new Error("Vehicle not available");

  const total_price = calculateTotalPrice(Number(vehicle.rows[0].daily_rent_price), rent_start_date, rent_end_date);

  const result = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, "active"]
  );

  await vehiclesService.setAvailability(vehicle_id, "booked");

  return result.rows[0];
};

const getBookingsForAdmin = async () => {
  const result = await pool.query(`SELECT * FROM bookings ORDER BY created_at DESC`);
  return result.rows;
};

const getBookingsForCustomer = async (customerId: string) => {
  const result = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1 ORDER BY created_at DESC`, [customerId]);
  return result.rows;
};

const getSingleBooking = async (bookingId: string) => {
  const result = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
  return result.rows[0];
};

const cancelBooking = async (bookingId: string, requesterId: string, requesterRole: string) => {
  const booking = await getSingleBooking(bookingId);
  if (!booking) throw new Error("Booking not found");
  if (requesterRole === "customer" && booking.customer_id !== requesterId) throw new Error("Forbidden");
  const today = new Date();
  const start = new Date(booking.rent_start_date);
  if (requesterRole === "customer") {
    if (today >= start) throw new Error("Cannot cancel booking on or after start date");
  }
  await pool.query(`UPDATE bookings SET status='cancelled', updated_at = now() WHERE id=$1`, [bookingId]);
  await vehiclesService.setAvailability(booking.vehicle_id, "available");
  return { message: "Booking cancelled" };
};

const markReturned = async (bookingId: string) => {
  const booking = await getSingleBooking(bookingId);
  if (!booking) throw new Error("Booking not found");
  await pool.query(`UPDATE bookings SET status='returned', updated_at = now() WHERE id=$1`, [bookingId]);
  await vehiclesService.setAvailability(booking.vehicle_id, "available");
  return { message: "Booking marked as returned" };
};

const autoReturnPastBookings = async () => {
  const today = new Date().toISOString().split("T")[0];
  const q = `SELECT id, vehicle_id FROM bookings WHERE status='active' AND rent_end_date < $1`;
  const res = await pool.query(q, [today]);
  for (const row of res.rows) {
    await pool.query(`UPDATE bookings SET status='returned', updated_at = now() WHERE id=$1`, [row.id]);
    await vehiclesService.setAvailability(row.vehicle_id, "available");
  }
  if (res.rows.length > 0) console.log(`Auto-returned ${res.rows.length} bookings.`);
};

export const bookingsService = { createBooking, getBookingsForAdmin, getBookingsForCustomer, getSingleBooking, cancelBooking, markReturned, autoReturnPastBookings };
