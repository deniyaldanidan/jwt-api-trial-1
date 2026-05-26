import { NextFunction, Request, Response } from "express";
import { UnAuthorizedError } from "../helpers/CustomErrors";
import { HTTP_STATUS_CODES } from "../helpers/constants";

export default function unauthorizedErrorHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof UnAuthorizedError) {
    return res
      .status(HTTP_STATUS_CODES.unauthorized)
      .json({ error: err.message });
  }
  next(err);
}
