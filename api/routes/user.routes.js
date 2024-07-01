import { Router } from "express";
import { deleteUser, updateUser } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = Router();

router.put("/update/:id",verifyUser, updateUser);
router.delete("/delete/:id",verifyUser, deleteUser);

export default router;
