import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { errorHandle } from "../utils/err.js";

export const SignUp = async (req, res, next) => {
  const { username, password, email } = req.body;
  if (!(username && password && email))
    return res.status(401).json({ message: "invalid inputs" });
  else {
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "user already exists" });
  }
  try {
    const hashedPass = bcrypt.hashSync(password, 8);
    const user = new User({ email, username, password: hashedPass });

    await user.save();
    res.status(201).json({ messsage: "user created successfully" });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};
