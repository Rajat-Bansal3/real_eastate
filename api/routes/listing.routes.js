import { Router } from "express";
import {
  createListing,
  showUserListing,
} from "../controllers/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = Router();

router.post("/create-listing", verifyUser, createListing);
router.get("/show-user-listings/:id", verifyUser, showUserListing);

export default router;
