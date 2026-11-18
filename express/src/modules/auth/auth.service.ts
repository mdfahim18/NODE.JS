import bcrypt from "bcryptjs";
import { pool } from "../../db";

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
};

export const authService = { loginUserIntoDB };
