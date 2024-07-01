import { Router } from "express";
import {
  SignUp,
  SignIn,
  Google,
  SignOut,
} from "../controllers/auth.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = Router();

router.get("/sign-out/:id", verifyUser, SignOut);
router.post("/sign-up", SignUp);
router.post("/sign-in", SignIn);
router.post("/google", Google);

export default router;
