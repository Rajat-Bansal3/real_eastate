import { Router } from "express";
import { SignUp, SignIn } from "../controllers/auth.controller.js";

const router = Router();

router.post("/sign-up", SignUp);
router.post("/sign-in", SignIn);

export default router;
