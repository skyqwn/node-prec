import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    default: "",
  },
  resetToken: String,
  resetTokenExpiration: Date,
  emailVerify: {
    type: Boolean,
    default: false,
  },
  emailVerifyString: {
    type: String,
    default: uuidv4(),
  },
});

const User = mongoose.model("User", userSchema);

export default User;

mongoose.Schema();
