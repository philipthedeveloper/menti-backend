import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide name"],
      minLength: [
        2,
        "The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH}).",
      ],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please provide email"],
      unique: [true],
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      trim: true,
      minLength: [
        8,
        "The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH}).",
      ],
    },
    gender: {
      type: String,
      required: [true, "Please provide gender"],
      trim: true,
      lowercase: true,
      enum: {
        values: ["male", "female"],
        message: "Invalid gender of {VALUE}",
      },
    },
    dob: {
      type: Date,
      required: [true, "Please provide date of birth"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Setup bcryptjs for password hashing
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  return (this.password = await bcrypt.hash(this.password, salt));
});

// Setup document method for password validation
UserSchema.methods.validatePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// Setup jwt for token management
UserSchema.methods.generateToken = function ({ userId, email }) {
  let token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    issuer: process.env.ISSUER,
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return token;
};

const User = mongoose.model("Users", UserSchema);

export default User;
