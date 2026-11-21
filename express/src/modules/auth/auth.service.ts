import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (playload: {
  email: string;
  password: string;
}) => {
  const { email, password } = playload;
  // Check if the user exits
  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email]
  );
  // console.log(user.rows[0]);
  if (user.rowCount === 0) {
    throw new Error("Invalid credentials!");
  }

  // Check if the password match
  const matchPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!matchPassword) {
    throw new Error("Invalid credentials");
  }

  // Check if the user is active or not
  if (!user.rows[0].is_active) {
    throw new Error("Access denied");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(jwtPayload, config.refresh_token, {
    expiresIn: "10d",
  });
  delete user.rows[0].password;
  return { accessToken, refreshToken, data: user.rows[0] };
};

const generateAccessToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized access");
  }

  const decoded = jwt.verify(token as string, config.jwt_secret) as JwtPayload;

  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [decoded.email]
  );

  if (user.rowCount === 0) {
    throw new Error("User not found");
  }
  if (!user.rows[0].is_active) {
    throw new Error("User Forbidden");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.refresh_token, {
    expiresIn: "1h",
  });

  return { accessToken };
};
export const authService = { loginUserIntoDB, generateAccessToken };
