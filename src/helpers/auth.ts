import jwt from "jsonwebtoken";
import "dotenv/config";
import { AccessPayloadType, RefreshPayloadType, UserRoleType } from "./types";
import { addDaysFromToday, daysInMilliSeconds } from "./helpers";
import { Response } from "express";
import authUserInfoZodSchema from "../zodSchema/authUserInfoSchema";

export function getAccessSecret() {
  const accessSecret = process.env.ACCESS_SECRET;
  if (!accessSecret) {
    throw new Error("ACCESS_SECRET is not provided");
  }
  return accessSecret;
}

export function getRefreshSecret() {
  const refreshSecret = process.env.REFRESH_SECRET;
  if (!refreshSecret) {
    throw new Error("REFRESH_SECRET is not provided");
  }
  return refreshSecret;
}

export function signAccess(payload: AccessPayloadType) {
  const accessSecret = getAccessSecret();
  return jwt.sign(payload, accessSecret, { expiresIn: "6h" });
}

export function signRefresh(payload: RefreshPayloadType) {
  const refreshSecret = getRefreshSecret();
  return {
    token: jwt.sign(payload, refreshSecret, { expiresIn: "3d" }),
    maxAge: daysInMilliSeconds(3),
    expires: addDaysFromToday(3),
  };
}

export function authUserInfo(res: Response): AccessPayloadType {
  const result = authUserInfoZodSchema.safeParse(res.locals);
  if (!result.success) {
    throw new Error("Couldn't get cuurent user-info from response-locals");
  }
  return result.data;
}
