import { NextFunction, Request, Response } from "express";
import { ZodError, flattenError } from "zod";
import { HTTP_STATUS_CODES } from "../helpers/constants";

export default function zodValidationErrHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ZodError) {
    const flatErr = flattenError(err);
    // console.log(flatErr);
    const errObj: any = {};
    if (flatErr.formErrors.length) {
      errObj["error"] = flatErr.formErrors[0];
    }
    if (Object.keys(flatErr.fieldErrors).length) {
      Object.keys(flatErr.fieldErrors).forEach((ky: any) => {
        errObj[ky] = (flatErr.fieldErrors as any)[ky][0];
      });
    }
    return res.status(HTTP_STATUS_CODES.badRequest).json(errObj);
  }

  next(err);
}
