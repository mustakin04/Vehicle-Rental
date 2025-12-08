import app from "./app";
import config from "./config";
import { initDB } from "./config/db";
import { bookingsService } from "./modules/bookings/bookings.service";

const start = async () => {
  try {
    // Init DB & tables
    await initDB();

    // Auto-return past bookings at startup
    await bookingsService.autoReturnPastBookings();

    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
