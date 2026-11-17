import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, age } = payload;

  const result = await pool.query(
    // pool.query() একটি Promise return করে।
    `
    INSERT INTO users (name, email, password, age) VALUES($1, $2, $3, $4) RETURNING *
    `,
    [name, email, password, age]
  );
  // console.log(result);
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(`
      SELECT * FROM users
      `);
  // console.log(result);
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
      SELECT * FROM users WHERE id=$1
      `,
    [id]
  );
  return result;
};

const updateUserFromDB = async (playload: Partial<IUser>, id: string) => {
  const { name, password, age, is_Active } = playload;
  const result = await pool.query(
    `
      UPDATE users
      SET
      name = COALESCE($1, name),
      password = COALESCE($2, password),
      age = COALESCE($3, age),
      is_Active = COALESCE($4, is_Active ),
      updated_at = NOW()
      WHERE id=$5 RETURNING *
      `,
    [name ?? null, password ?? null, age ?? null, is_Active ?? null, id]
  );
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
  DELETE FROM users WHERE id=$1
  `,
    [id]
  );

  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  deleteUserFromDB
};
