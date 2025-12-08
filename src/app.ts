import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import vehiclesRoutes from "./modules/vehicles/vehicles.routes";
import bookingsRoutes from "./modules/bookings/bookings.routes";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// API versioning
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);
app.use("/api/v1/bookings", bookingsRoutes);

// Basic health route
app.get("/health", (_req, res) => res.json({ status: "ok" }));

export default app;
