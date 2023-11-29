import { StatusCodes } from "http-status-codes";
export const sendSuccessResponse = (res, data = {}, status = StatusCodes.OK) =>
  res.status(status).json({ success: true, status, ...data });
