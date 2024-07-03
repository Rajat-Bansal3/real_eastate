import Listing from "../models/Listing.model.js";

export const createListing = async (req, res) => {
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
