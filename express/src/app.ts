import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import dotenv from "dotenv";
import path from "node:path";
import { pool } from "./db";
import { userRoute } from "./modules/users/user.route";
import { profileRoute } from "./modules/profile/profile.route";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // nested

app.use("/api/v1/users", userRoute);
app.use("/api/v1/profile", profileRoute);

app.get("/", (req: Request, res: Response) => {
  // res.send("This is root route");
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "PH",
  });
});

export default app;
