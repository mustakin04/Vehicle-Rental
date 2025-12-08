import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
   port: process.env.PORT ? Number(process.env.PORT) : 5000,
  connection_str: process.env.DATABASE_URL || "",
  jwt_secret: process.env.JWT_SECRET || "secretkey",}


export default config;
