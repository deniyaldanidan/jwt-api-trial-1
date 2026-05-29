import { Request, Response } from "express";
import { authUserInfo } from "../../helpers/auth";
import { OperationFailedError } from "../../helpers/CustomErrors";
import z from "zod";
import db from "../../db/db";
import { wishlists } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function removeItemFromWishlistController(
  req: Request,
  res: Response,
) {
  const { userId } = authUserInfo(res);
  const itemIdParserResult = z
    .int()
    .safeParse(parseInt(req.params.id as string));
  if (!itemIdParserResult.success) {
    throw new OperationFailedError("Invalid item id");
  }

  await db
    .delete(wishlists)
    .where(
      and(
        eq(wishlists.user_id, userId),
        eq(wishlists.item_id, itemIdParserResult.data),
      ),
    );

  return res.sendStatus(HTTP_STATUS_CODES.success);
}
