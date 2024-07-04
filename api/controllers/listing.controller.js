import Listing from "../models/Listing.model.js";
import { errorHandle } from "../utils/err.js";

export const createListing = async (req, res, next) => {
  try {
    const body = req.body;

    const newListing = new Listing(body);

    await newListing.save();

    res
      .status(201)
      .json({ message: "Listing created successfully", listing: newListing });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const showUserListing = async (req, res, next) => {
  const id = req.params.id;
  if (id !== req.user.id) {
    return next(errorHandle(401, "hahaha , gotchu dibs"));
  }
  try {
    const listings = await Listing.find({ ownerRef: id });
    if (listings.length === 0 || !listings) {
      return next(errorHandle(404, "no listings found"));
    }
    res.status(200).json({ listings });
  } catch (error) {
    next(error);
  }
};
