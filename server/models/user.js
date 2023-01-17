import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

const userSchema = mongoose.Schema({
  id: String,
  name: String,
  email: String,
  username: String,
  followers: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
  ],
  following: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
  ],
  profileImg: {
    type: String,
    default: null,
  },
  uploades: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: PostMessage,
      default: [],
    },
  ],
  password: String,
  mobile: {
    type: String,
  },
  age: {
    type: Number,
  },
  notifications: [
    {
      type: String,
    },
    { type: String },
  ],
});

const user = mongoose.model("user", userSchema);

export default user;
