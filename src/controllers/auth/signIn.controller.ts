import { Request, Response } from "express";
import signInZodSchema from "../../zodSchema/signInZodSchema";
import {
  signInRefreshCookieOptions,
  signInSuccessObj,
} from "../../helpers/helpers";
import db from "../../db/db";
import { sessions, users } from "../../db/schema";
import { eq, or } from "drizzle-orm";
import { UnAuthorizedError } from "../../helpers/CustomErrors";
import {
  HTTP_STATUS_CODES,
  REFRESH_COOKIE_NAME,
} from "../../helpers/constants";
import bcrypt from "bcrypt";
import { signAccess, signRefresh } from "../../helpers/auth";

export default async function signInController(
  req: Request,
  res: Response,
): Promise<Response<ReturnType<typeof signInSuccessObj>>> {
  //   Validate the data
  const parsedData = signInZodSchema.parse(req.body);
  //  See if requested user exist in DB?
  const dbResult = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.username, parsedData.unameOrEmail),
        eq(users.email, parsedData.unameOrEmail),
      ),
    );
  const foundUser = dbResult[0];
  if (!foundUser?.id || !foundUser?.role) {
    throw new UnAuthorizedError("Login failed. Invalid Credentials.");
  }
  // compare pwd
  const match = await bcrypt.compare(parsedData.pwd, foundUser.password);
  if (!match) {
    throw new UnAuthorizedError("Login failed. Invalid Credentials");
  }
  // create tokens
  const accessToken = signAccess({
    userId: foundUser.id,
    username: foundUser.username,
    role: foundUser.role,
  });
  const refreshTokenData = signRefresh({ username: foundUser.username });

  // Check how many sessions user currently has: If he has more than 3 DELETE ALL
  const foundSessions = await db
    .select()
    .from(sessions)
    .where(eq(sessions.user_id, foundUser.id));

  if (foundSessions.length > 3) {
    await db.delete(sessions).where(eq(sessions.user_id, foundUser.id));
  }

  // save refresh_token to the db
  await db.insert(sessions).values({
    user_id: foundUser.id,
    refresh_token: refreshTokenData.token,
    expires: refreshTokenData.expires,
  });
  // set refresh_token cookie
  res.cookie(
    REFRESH_COOKIE_NAME,
    refreshTokenData.token,
    signInRefreshCookieOptions(refreshTokenData.maxAge),
  );
  // send the access-token to the user
  return res
    .status(HTTP_STATUS_CODES.success)
    .json(signInSuccessObj(accessToken));
}
