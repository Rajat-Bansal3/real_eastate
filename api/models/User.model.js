import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://imgs.search.brave.com/5cAi-jXDh0PdCGuh2vvsggwMUWvGlmTFmbCQ7jYJ9OI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", UserSchema);
export default User;
