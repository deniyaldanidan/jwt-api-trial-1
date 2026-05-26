import { Request, Response } from "express";
import z from "zod";
import {
  HTTP_STATUS_CODES,
  REFRESH_COOKIE_NAME,
} from "../../helpers/constants";
import db from "../../db/db";
import { sessions } from "../../db/schema";
import { eq } from "drizzle-orm";
import { signInRefreshCookieOptions } from "../../helpers/helpers";

export default async function logoutController(req: Request, res: Response) {
  // Check if the cookie has the refresh-token?
  const validRefreshCookieParseResult = z
    .jwt()
    .safeParse(req.cookies[REFRESH_COOKIE_NAME] ?? "");
  if (validRefreshCookieParseResult.success) {
    // If found, Check if it is in db => If true then delete from DB
    const foundCookie = await db
      .select()
      .from(sessions)
      .where(eq(sessions.refresh_token, validRefreshCookieParseResult.data));

    if (foundCookie.length) {
      await db
        .delete(sessions)
        .where(eq(sessions.refresh_token, validRefreshCookieParseResult.data));
    }
  }
  // Delete user's client side cookie by sending an empty cookie
  res.cookie(REFRESH_COOKIE_NAME, "", signInRefreshCookieOptions(0));
  // Send success response
  return res.sendStatus(HTTP_STATUS_CODES.success);
}
