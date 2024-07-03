import { Router } from "express";
import { createListing } from "../controllers/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = Router();

router.post("/create-listing", verifyUser, createListing);

export default router;
