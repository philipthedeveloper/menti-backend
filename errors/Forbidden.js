import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError.js";

export default class ForbiddenError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export const createForbiddenError = (message) => new ForbiddenError(message);
