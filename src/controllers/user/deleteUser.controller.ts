import { Request, Response } from "express";
import { authUserInfo } from "../../helpers/auth";
import db from "../../db/db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function deleteUserController(_: Request, res: Response) {
  const { userId } = authUserInfo(res);

  await db.delete(users).where(eq(users.id, userId));
  return res.sendStatus(HTTP_STATUS_CODES.success);
}
