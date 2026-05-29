import { Request, Response } from "express";
import { authUserInfo } from "../../helpers/auth";
import db from "../../db/db";
import { carts } from "../../db/schema";
import { eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function clearCartController(_: Request, res: Response) {
  const { userId } = authUserInfo(res);

  await db.delete(carts).where(eq(carts.user_id, userId));
  return res.sendStatus(HTTP_STATUS_CODES.success);
}
