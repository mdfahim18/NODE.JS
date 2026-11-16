import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app: Application = express();
const port = 5000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // eta erokom keno

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing from the environment");
}

const pool = new Pool({ connectionString: databaseUrl });

// id SERIAL PRIMARY KEY, ei line bujini SERIAL, PRIMARY, KEY egula mane ki? egula ki data type?
const initDB = async () => {
  try {
    pool.query(`
      CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) NOT NULL,
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

app.post("/", async (req: Request, res: Response) => {
  // console.log(req.body); // middleware use na korle undefined asbe. middleware use korte "use" lekte hoy

  const { name, age, password } = req.body;

  res.status(200).json({
    success: true,
    message: "This is a test api!!",
    data: { name, age },
  });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
