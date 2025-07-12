
import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandlers } from "./app/middlewares/global.error.handlers";
import notFound from './app/middlewares/notFound';

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).send({
    success: true,
    message: "Welcome to tour management system",
  });
});

app.use(globalErrorHandlers);
app.use(notFound)

export default app;
