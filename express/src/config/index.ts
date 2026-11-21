import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is missing from the environment");
}

const refreshToken = process.env.REFRESH_TOKEN;
if (!jwtSecret) {
  throw new Error("REFRESH_TOKEN is missing from the environment");
}

const config = {
  port: process.env.PORT,
  connection_string: process.env.DATABASE_URL as string,
  jwt_secret: jwtSecret,
  refresh_token: refreshToken as string,
};

export default config;
