import express, { Request, Response } from "express";
const app = express();

app.get("/", async (req: Request, res: Response) => {
  res.status(200).send({
    success: true,
    message: "Welcome to tour management system",
  });
});

export default app;
