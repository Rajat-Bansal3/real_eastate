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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
    const totalListings = await Listing.countDocuments({ ownerRef: id });
    const listings = await Listing.find({ ownerRef: id })
      .skip(skip)
      .limit(limit);
    if (!listings.length) {
      return next(errorHandle(404, "no listings found"));
    }
    res.status(200).json({
      listings,
      totalListings,
      totalPages: Math.ceil(totalListings / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};
