import { pool } from "../../config/db";

const createVehicle = async (payload: any) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );
  return result.rows[0];
};

const getVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles ORDER BY created_at DESC`);
  return result.rows;
};

const getSingleVehicle = async (vehicleId: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicleId]);
  return result.rows[0];
};

const updateVehicle = async (vehicleId: string, patch: any) => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  if (patch.vehicle_name) { fields.push(`vehicle_name=$${idx++}`); values.push(patch.vehicle_name); }
  if (patch.type) { fields.push(`type=$${idx++}`); values.push(patch.type); }
  if (patch.registration_number) { fields.push(`registration_number=$${idx++}`); values.push(patch.registration_number); }
  if (patch.daily_rent_price !== undefined) { fields.push(`daily_rent_price=$${idx++}`); values.push(patch.daily_rent_price); }
  if (patch.availability_status) { fields.push(`availability_status=$${idx++}`); values.push(patch.availability_status); }

  if (fields.length === 0) throw new Error("No valid fields to update");
  values.push(vehicleId);
  const q = `UPDATE vehicles SET ${fields.join(",")}, updated_at = now() WHERE id = $${idx} RETURNING *`;
  const result = await pool.query(q, values);
  return result.rows[0];
};

const deleteVehicle = async (vehicleId: string) => {
  const check = await pool.query(`SELECT COUNT(*) as cnt FROM bookings WHERE vehicle_id=$1 AND status='active'`, [vehicleId]);
  if (Number(check.rows[0].cnt) > 0) throw new Error("Cannot delete vehicle with active bookings");
  await pool.query(`DELETE FROM vehicles WHERE id=$1`, [vehicleId]);
  return { message: "Vehicle deleted" };
};

const setAvailability = async (vehicleId: string, status: "available" | "booked") => {
  await pool.query(`UPDATE vehicles SET availability_status=$1, updated_at = now() WHERE id=$2`, [status, vehicleId]);
};

export const vehiclesService = { createVehicle, getVehicles, getSingleVehicle, updateVehicle, deleteVehicle, setAvailability };
