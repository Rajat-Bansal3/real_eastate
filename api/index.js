import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRouter from "./routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("connect to mongo");
});

app.use("/v1/api/auth", authRouter);

app.use((err, req, res, next) => {
  const erre = err.statusCode | 500;
  const msg = err.message | "Internal Server Error";
  return res.status(err).json({ success: false, message: msg, status: erre });
});

app.listen(3000, () => {
  console.log("running on 3000");
});
