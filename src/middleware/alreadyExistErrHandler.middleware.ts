import { NextFunction, Request, Response } from "express";
import { AlreadyExistError } from "../helpers/CustomErrors";
import { HTTP_STATUS_CODES } from "../helpers/constants";

export default function alreadyExistErrHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AlreadyExistError) {
    return res.status(HTTP_STATUS_CODES.conflict).json({ error: err.message });
  }

  next(err);
}
