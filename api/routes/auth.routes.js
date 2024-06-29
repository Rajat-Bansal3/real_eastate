import { Router } from "express";
import { SignUp, SignIn, Google } from "../controllers/auth.controller.js";

const router = Router();

router.post("/sign-up", SignUp);
router.post("/sign-in", SignIn);
router.post("/google", Google);

export default router;
