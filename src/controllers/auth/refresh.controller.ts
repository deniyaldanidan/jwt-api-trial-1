import { Request, Response } from "express";
import z from "zod";
import {
  HTTP_STATUS_CODES,
  REFRESH_COOKIE_NAME,
} from "../../helpers/constants";
import db from "../../db/db";
import { sessions, users } from "../../db/schema";
import { eq } from "drizzle-orm";
import {
  signInRefreshCookieOptions,
  signInSuccessObj,
} from "../../helpers/helpers";
import { UnAuthorizedError } from "../../helpers/CustomErrors";
import { getRefreshSecret, signAccess } from "../../helpers/auth";
import jwt from "jsonwebtoken";

export default async function refreshController(req: Request, res: Response) {
  // Check if the cookie has the refresh-token?
  const validRefreshCookieParseResult = z
    .jwt()
    .safeParse(req.cookies[REFRESH_COOKIE_NAME] ?? "");
  // If not found or not correct throw an UnAuthorizedError
  if (!validRefreshCookieParseResult.success) {
    throw new UnAuthorizedError("UnAuthorized action");
  }

  // * validate the token first
  jwt.verify(
    validRefreshCookieParseResult.data,
    getRefreshSecret(),
    (err, _) => {
      if (err) {
        throw new UnAuthorizedError("UnAuthorized action");
      }
    },
  );

  // If found, Check if it is in db => If not again throw an UnAuthorizedError
  const refreshDbQueryResult = await db
    .select()
    .from(sessions)
    .where(eq(sessions.refresh_token, validRefreshCookieParseResult.data));

  const foundCookie = refreshDbQueryResult[0];

  if (!foundCookie?.refresh_token) {
    res.cookie(REFRESH_COOKIE_NAME, "", signInRefreshCookieOptions(0));
    throw new UnAuthorizedError("UnAuthorized action");
  }
  // IF found in DB, then create new accessToken and send to user
  const userDbQueryResult = await db
    .select()
    .from(users)
    .where(eq(users.id, foundCookie.user_id));
  const foundUser = userDbQueryResult[0];

  if (!foundUser?.id || !foundUser.role) {
    throw new Error("Unknown error happened");
  }
  const accessToken = signAccess({
    userId: foundUser.id,
    username: foundUser.username,
    role: foundUser.role,
  });
  return res
    .status(HTTP_STATUS_CODES.success)
    .json(signInSuccessObj(accessToken));
}
