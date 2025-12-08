import { Router } from "express";
import { body } from "express-validator";
import { bookingsControllers } from "./bookings.controller";
import { handleValidation } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// Create booking (Customer or Admin)
router.post(
  "/",
  authenticate,
  [
    body("vehicle_id").notEmpty(),
    body("rent_start_date").isISO8601(),
    body("rent_end_date").isISO8601()
  ],
  handleValidation,
  bookingsControllers.createBooking
);
router.get("/", authenticate, bookingsControllers.getBookings);
router.put("/:bookingId", authenticate, bookingsControllers.updateBooking);

export default router;
