import { Request, Response } from "express";
import signUpZodSchema from "../../zodSchema/signUpZodSchema";
import db from "../../db/db";
import { sessions, users } from "../../db/schema";
import { eq, or } from "drizzle-orm";
import { AlreadyExistError } from "../../helpers/CustomErrors";
import bcrypt from "bcrypt";
import {
  HTTP_STATUS_CODES,
  REFRESH_COOKIE_NAME,
  userRolesObj,
} from "../../helpers/constants";
import { signAccess, signRefresh } from "../../helpers/auth";
import {
  signInRefreshCookieOptions,
  signInSuccessObj,
} from "../../helpers/helpers";

export default async function signUpController(
  req: Request,
  res: Response,
): Promise<Response<ReturnType<typeof signInSuccessObj>>> {
  // Validate the data
  const parsedData = signUpZodSchema.parse(req.body);
  // Check if user already exists
  const foundUser = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.username, parsedData.username),
        eq(users.email, parsedData.email),
      ),
    );
  if (foundUser.length) {
    throw new AlreadyExistError("Account already exists, Try sign-in");
  }
  // hash the pwd
  const hashedPwd = await bcrypt.hash(parsedData.password, 10);
  // insert user-data into DB
  const dbResult = await db
    .insert(users)
    .values({
      username: parsedData.username,
      email: parsedData.email,
      password: hashedPwd,
      role: userRolesObj.user,
    })
    .returning();

  // Check if the Newly Created User is properly created
  const newUser = dbResult[0];
  if (!newUser?.id) {
    throw new Error(
      "Unknown error happened during user-creation in sign-up endpoint",
    );
  }
  // Create the tokens
  const accessToken = signAccess({
    userId: newUser.id,
    username: newUser.username,
    role: userRolesObj.user,
  });
  const refreshTokenData = signRefresh({ username: newUser.username });
  // Save refresh-token in DB
  await db.insert(sessions).values({
    user_id: newUser.id,
    expires: refreshTokenData.expires,
    refresh_token: refreshTokenData.token,
  });
  // Set Refresh-Cookie
  res.cookie(
    REFRESH_COOKIE_NAME,
    refreshTokenData.token,
    signInRefreshCookieOptions(refreshTokenData.maxAge),
  );
  // Send the Access-Token
  return res
    .status(HTTP_STATUS_CODES.created)
    .json(signInSuccessObj(accessToken));
}
