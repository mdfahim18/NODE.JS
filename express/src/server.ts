import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "node:path";
import config from "./config";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app: Application = express();
const port = 5000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // eta erokom keno

const pool = new Pool({ connectionString: config.connection_string });

// id SERIAL PRIMARY KEY, ei line bujini SERIAL, PRIMARY, KEY egula mane ki? egula ki data type?
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      age INT,
      is_Active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()

      );
  `);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};

initDB();
app.get("/", (req: Request, res: Response) => {
  // res.send("This is root route");
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "PH",
  });
});

app.post("/api/v1/users", async (req: Request, res: Response) => {
  // console.log(req.body); // middleware use na korle undefined asbe. middleware use korte "use" lekte hoy

  try {
    const { name, email, password, age } = req.body;

    const result = await pool.query(
      `
    INSERT INTO users (name, email, password, age) VALUES($1, $2, $3, $4) RETURNING *
    `,
      [name, email, password, age]
    );
    // console.log(result);
    res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.get("/api/v1/users", async (req: Request, res: Response) => {
  // get e o async keno
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `);
    // console.log(result);

    res.status(200).json({
      success: true,
      message: "User retrived successfully!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  // ekane id te colun keno
  try {
    const { id } = req.params;
    // console.log("single user", req);
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id=$1
      `,
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({
        success: true,
        message: "User not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "User retrived successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, password, age, is_Active } = req.body;
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
    if (result.rowCount === 0) {
      res.status(404).json({
        success: true,
        message: "User not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
  DELETE FROM users WHERE id=$1
  `,
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: true,
        message: "User not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${port}`);
});
