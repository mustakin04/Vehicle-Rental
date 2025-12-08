import { Pool } from "pg";
import config from "./index";

export const pool = new Pool({
  connectionString: config.connection_str,
});
export const initDB = async () => {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      phone TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin','customer')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      vehicle_name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('car','bike','van','SUV')),
      registration_number TEXT NOT NULL UNIQUE,
      daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
      availability_status TEXT NOT NULL CHECK (availability_status IN ('available','booked')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL,
      total_price NUMERIC NOT NULL CHECK (total_price > 0),
      status TEXT NOT NULL CHECK (status IN ('active','cancelled','returned')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `);

  // Indexes
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_bookings_vehicle ON bookings(vehicle_id);`);

  console.log("✅ Database initialized successfully!");
};
