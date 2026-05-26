import { NextFunction, Request, Response } from "express";
import { AccessPayloadType, UserRoleType } from "../helpers/types";
import bearerTokenZodSchema from "../zodSchema/bearerTokenSchema";
import { ForbiddenError } from "../helpers/CustomErrors";
import z from "zod";
import jwt from "jsonwebtoken";
import { getAccessSecret } from "../helpers/auth";

export default function authMiddleware(acceptedRoles: UserRoleType[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const bearerParsedResult = bearerTokenZodSchema.safeParse(
      req.headers?.authorization || req.headers?.Authorization,
    );

    if (!bearerParsedResult.success) {
      throw new ForbiddenError("Invalid Auth");
    }
    const bearerTokenParsedResult = z
      .jwt()
      .safeParse(bearerParsedResult.data.split(" ")[1]);

    if (!bearerTokenParsedResult.success) {
      throw new ForbiddenError("Invalid Auth");
    }

    const authToken = bearerTokenParsedResult.data;

    jwt.verify(authToken, getAccessSecret(), (err, decoded) => {
      if (err) {
        throw new ForbiddenError("Invalid Auth");
      }
      const payload = decoded as AccessPayloadType;

      // Check if they have the Required role
      const foundRole = acceptedRoles.find((val) => val == payload.role);
      if (!foundRole) {
        throw new ForbiddenError("Invalid Action");
      }

      res.locals.userId = payload.userId;
      res.locals.username = payload.username;
      res.locals.role = foundRole;
    });

    next();
  };
}
