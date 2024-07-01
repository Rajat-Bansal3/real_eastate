import jwt from "jsonwebtoken";
import { errorHandle } from "./err.js";

export const verifyUser = (req,res,next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandle(401, "unauthorised"));
  }
  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return next(errorHandle(401, "unauthorised"));
    if (user) {
      req.user = user;
      next();
    }
  });
};
