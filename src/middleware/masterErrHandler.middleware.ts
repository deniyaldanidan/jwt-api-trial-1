import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../helpers/constants";

export default function masterErrHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err);
  return res
    .status(HTTP_STATUS_CODES.internalServerErr)
    .json({ error: "Unknown error happened, Try again" });
}
