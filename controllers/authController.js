import { User } from "../models/index.js";
import {
  checkEmptyRequestBody,
  sendSuccessResponse,
  throwBadRequestError,
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
