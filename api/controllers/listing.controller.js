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

export const deleteUserListing = async (req, res, next) => {
  console.log(req.query);
  const id = req.query.lid;
  const userId = req.query.id;
  if (userId !== req.user.id) {
    return next(errorHandle(401, "hahaha , gotchu dibs"));
  }
  try {
    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) return next(errorHandle(404, "no Such Listing"));
    res.status(204).json({ message: "Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateUserListing = async (req, res, next) => {
  const id = req.query.id;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return next(errorHandle(404, "no listing found"));
    }
    if (req.user.id !== listing.ownerRef)
      return next(errorHandle(401, "hahaha , gotchu dibs"));

    const newL = await Listing.findByIdAndUpdate(id, req.body, { new: true });
    res.status(203).json({ newL });
  } catch (error) {
    next(error);
  }
};
export const getListing = async (req, res, next) => {
  const id = req.query.id;
  try {
    const listing = await Listing.findById(id);
    if (!listing) return next(errorHandle(404, "No Listing Found"));
    res.status(200).json({ listing });
  } catch (error) {
    next(error);
  }
};
