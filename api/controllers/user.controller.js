import User from "../models/User.model.js";
import { errorHandle } from "../utils/err.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (id !== req.user.id) {
      return next(errorHandle(401, "Not you haha haha, dibs on you"));
    }
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    res.status(201).json({ ret: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (id !== req.user.id)
      return next(errorHandle(401, "Not you haha haha, dibs on you"));
    await User.findByIdAndDelete(id);
    res.clearCookie("access_token").status(204).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
