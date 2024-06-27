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

app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("running on 3000");
});
