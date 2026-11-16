import express, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express();
const port = 5000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // eta erokom keno

app.get("/", (req: Request, res: Response) => {
  // res.send("This is root route");
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "PH",
  });
});

app.post("/", (req: Request, res: Response) => {
  console.log(req.body); // middleware use na korle undefined asbe. middleware use korte "use" lekte hoy
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
