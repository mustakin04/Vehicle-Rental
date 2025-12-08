import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";

const signup = async (name: string, email: string, password: string, phone: string, role: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name,email,password,phone,role) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role,created_at`,
    [name, email.toLowerCase(), hashedPassword, phone, role]
  );
  return result.rows[0];
};

const signin = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email.toLowerCase()]);
  if (!result.rows[0]) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, result.rows[0].password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, config.jwt_secret, { expiresIn: "1d" });
  const user = { id: result.rows[0].id, name: result.rows[0].name, email: result.rows[0].email, role: result.rows[0].role };
  return { user, token };
};

export const authService = { signup, signin };
