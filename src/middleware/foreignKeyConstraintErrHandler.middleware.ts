import { LibsqlError } from "@libsql/client";
import { DrizzleQueryError } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { ResourceNotFoundError } from "../helpers/CustomErrors";

export default function foreignKeyConstraintErrHandler(message?: string) {
  return (err: Error, _: Request, __: Response, next: NextFunction) => {
    if (err instanceof DrizzleQueryError && err.cause instanceof LibsqlError) {
      if (err.cause.rawCode == 787) {
        throw new ResourceNotFoundError(message);
      }
    }
    next(err);
  };
}
