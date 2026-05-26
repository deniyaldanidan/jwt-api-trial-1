import { NextFunction, Request, Response } from "express";
import { OperationFailedError } from "../helpers/CustomErrors";

export default function operationFailedErrHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof OperationFailedError) {
    return res
      .status(err.statusCode)
      .json({ success: false, error: err.message });
  }
  next(err);
}
