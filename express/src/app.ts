import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import dotenv from "dotenv";
import path from "node:path";
import { userRoute } from "./modules/users/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import fs from "fs";
import logger from "./middlewares/logger";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // nested

app.use(logger);

app.use("/api/v1/users", userRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/auth", authRoute);

app.get("/", (req: Request, res: Response) => {
  // res.send("This is root route");
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "PH",
  });
});

export default app;
