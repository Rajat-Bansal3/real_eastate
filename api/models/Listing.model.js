import mongoose, { Schema, model } from "mongoose";

const listingSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regular_price: {
      type: String,
      required: true,
    },
    discount: {
      type: String,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: [
      {
        type: String,
        required: true,
      },
    ],
    ownerRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = model("Listing", listingSchema);

export default Listing;
