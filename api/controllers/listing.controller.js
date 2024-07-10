import Listing from "../models/Listing.model.js";
import User from "../models/User.model.js";
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
export const getUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const resp = await User.findById(id);
    if (!resp) return next(errorHandle(404, "Not Found"));

    res.status(200).json({ user: resp });
  } catch (error) {
    next(error);
  }
};
export const getSearchRes = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) - 1 || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
