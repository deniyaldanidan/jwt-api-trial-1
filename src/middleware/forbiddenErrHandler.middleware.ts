import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../helpers/CustomErrors";
import { HTTP_STATUS_CODES } from "../helpers/constants";

export default function forbiddedErrHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ForbiddenError) {
    return res.status(HTTP_STATUS_CODES.forbidden).json({ error: err.message });
  }
  next(err);
}
