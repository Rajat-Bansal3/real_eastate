import { Router } from "express";
import {
  createListing,
  showUserListing,
  deleteUserListing,
} from "../controllers/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = Router();

router.post("/create-listing", verifyUser, createListing);
router.get("/show-user-listings/:id", verifyUser, showUserListing);
router.delete("/delete-user-listings", verifyUser, deleteUserListing);

export default router;
