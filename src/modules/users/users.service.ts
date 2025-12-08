import { pool } from "../../config/db";
import bcrypt from "bcrypt";

const createUser = async (name: string, email: string, password: string, phone: string, role = "customer") => {
  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name,email,password,phone,role) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role,created_at`,
    [name, email.toLowerCase(), hashed, phone, role]
  );
  return result.rows[0];
};

const getUsers = async () => {
  const result = await pool.query(`SELECT id,name,email,phone,role,created_at FROM users ORDER BY created_at DESC`);
  return result.rows;
};

const getSingleUser = async (userId: string) => {
  const result = await pool.query(`SELECT id,name,email,phone,role,created_at FROM users WHERE id=$1`, [userId]);
  return result.rows[0];
};

const updateUser = async (userId: string, patch: any) => {
  // allow updating name, email, phone, role (if provided)
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  if (patch.name) { fields.push(`name=$${idx++}`); values.push(patch.name); }
  if (patch.email) { fields.push(`email=$${idx++}`); values.push(patch.email.toLowerCase()); }
  if (patch.phone) { fields.push(`phone=$${idx++}`); values.push(patch.phone); }
  if (patch.role) { fields.push(`role=$${idx++}`); values.push(patch.role); }
  if (fields.length === 0) throw new Error("No valid fields to update");
  values.push(userId);
  const q = `UPDATE users SET ${fields.join(",")}, updated_at = now() WHERE id = $${idx} RETURNING id,name,email,phone,role,updated_at`;
  const result = await pool.query(q, values);
  return result.rows[0];
};

const deleteUser = async (userId: string) => {
  const check = await pool.query(`SELECT COUNT(*) as cnt FROM bookings WHERE customer_id=$1 AND status='active'`, [userId]);
  if (Number(check.rows[0].cnt) > 0) throw new Error("Cannot delete user with active bookings");
  await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);
  return { message: "User deleted" };
};

export const usersService = { createUser, getUsers, getSingleUser, updateUser, deleteUser };
