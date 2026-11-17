import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import dotenv from "dotenv";
import path from "node:path";
import { pool } from "./db";
import { userRoute } from "./modules/users/user.route";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // nested

app.use("/api/v1/users", userRoute);

app.get("/", (req: Request, res: Response) => {
  // res.send("This is root route");
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "PH",
  });
});





app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
 
});

export default app;
