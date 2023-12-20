import { User } from "../models/index.js";
import {
  checkEmptyRequestBody,
  sendSuccessResponse,
  throwBadRequestError,
  throwUnauthorizedError,
} from "../helpers/index.js";
import { StatusCodes } from "http-status-codes";

export const register = async (req, res) => {
  const isEmptyBody = checkEmptyRequestBody(req.body);
  if (isEmptyBody) throwBadRequestError("Please provide all credentials");
  const newUser = await User.create(req.body);
  // Create a new object by excluding the password field
  const userWithoutPassword = { ...newUser._doc };
  // Remove the password field from the new object
  delete userWithoutPassword.password;
  const { _id, email } = userWithoutPassword;
  const accessToken = newUser.generateToken({
    userId: _id,
    email,
  });
  return sendSuccessResponse(
    res,
    { user: userWithoutPassword, accessToken },
    StatusCodes.CREATED
  );
};

// Login controller
export const login = async (req, res) => {
  const isEmptyBody = checkEmptyRequestBody(req.body);
  if (isEmptyBody) throwBadRequestError("Please provide all credentials");
  if (!req.body.email || !req.body.password) {
    throwBadRequestError("Email and password required");
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) throwUnauthorizedError("Invalid Email or Password");
  // Validate the password using the document method (validatePassword)
  /**
   * @function
   * @argument password @type String
   * @returns @type Boolean
   */
  const isValidPassword = await user.validatePassword(req.body.password);
  if (!isValidPassword) throwUnauthorizedError("Invalid Email or Password");
  user.isLoggedIn = true;
  await user.save();
  // Create a new object by excluding the password field
  const userWithoutPassword = { ...user._doc };
  // Remove the password field from the new object
  delete userWithoutPassword.password;
  const { _id, email } = userWithoutPassword;
  const accessToken = user.generateToken({
    userId: _id,
    email,
  });
  return sendSuccessResponse(
    res,
    { user: userWithoutPassword, accessToken },
    StatusCodes.OK
  );
};

export const logout = async (req, res) => {
  if (req.currentUser && req.currentUser.isLoggedIn) {
    const isEmptyBody = checkEmptyRequestBody(req.body);
    if (isEmptyBody) throwBadRequestError("Please provide req body");
    if (!req.body.email) throwBadRequestError("Email required");
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { isLoggedIn: false }
    );
    if (!user) throwUnauthorizedError("Unauthorized user");
    return sendSuccessResponse(res, { message: "Logout successful" });
  }
  throwUnauthorizedError("User not authenticated");
};

export const getUser = async (req, res) => {
  if (req.currentUser && req.currentUser.isLoggedIn) {
    const currentUser = req.currentUser;
    // Create a new object by excluding the password field
    const userWithoutPassword = { ...currentUser._doc };
    // Remove the password field from the new object
    delete userWithoutPassword.password;
    return sendSuccessResponse(res, {
      user: userWithoutPassword,
      message: "Successful",
    });
  }
  throwUnauthorizedError("User not authenticated");
};
