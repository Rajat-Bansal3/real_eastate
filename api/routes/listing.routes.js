import { Router } from "express";
import {
  createListing,
  showUserListing,
  deleteUserListing,
  updateUserListing,
  getListing,
  getUser,
  getSearchRes,
} from "../controllers/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = Router();

router.get("/get", getSearchRes);
router.post("/create-listing", verifyUser, createListing);
router.get("/show-user-listings/:id", verifyUser, showUserListing);
router.delete("/delete-user-listings", verifyUser, deleteUserListing);
router.put("/update-user-listing", verifyUser, updateUserListing);
router.get("/get-listing", getListing);
router.get("/:id", verifyUser, getUser);

export default router;
