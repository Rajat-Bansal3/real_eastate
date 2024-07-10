import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { errorHandle } from "../utils/err.js";
import jwt from "jsonwebtoken";

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
    next(err);
  }
};
export const SignIn = async (req, res, next) => {
  const { password, email } = req.body;

  if (!(password && email)) {
    return res.status(400).json({ message: "Invalid inputs" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandle(404, "User not found"));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return next(errorHandle(401, "Incorrect email or password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    const { password: userPass, ...ret } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 365),
      })
      .status(200)
      .json({ ret });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};
export const Google = async (req, res, next) => {
  const { name, email, photo } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const nu = new User({
        username:
          name.split("").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: email,
        password: bcrypt.hashSync(
          Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8),
          10
        ),
        avatar: photo,
      });
      await nu.save();
      const token = jwt.sign({ id: nu._id }, process.env.SECRET);
      const { password: userPass, ...ret } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 365),
        })
        .status(200)
        .json({ ret });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.SECRET);
      const { password: userPass, ...ret } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 365),
        })
        .status(200)
        .json({ ret });
    }
  } catch (error) {
    next(error);
  }
};
export const SignOut = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (id !== req.user.id) {
      return next(errorHandle(401, "Not you haha haha, dibs on you"));
    }
    res.clearCookie("access_token").status(204).json({});
  } catch (error) {
    next(error);
  }
};
