import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../helpers/constants";

export default function jsonParseErrHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof SyntaxError) {
    return res
      .status(HTTP_STATUS_CODES.badRequest)
      .json({ error: "Invalid Json" });
  }
  next(err);
}
