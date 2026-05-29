import { Request, Response } from "express";
import { authUserInfo } from "../../helpers/auth";
import z from "zod";
import { HTTP_STATUS_CODES } from "../../helpers/constants";
import {
  AlreadyExistError,
  OperationFailedError,
} from "../../helpers/CustomErrors";
import db from "../../db/db";
import { wishlists } from "../../db/schema";
import { and, eq } from "drizzle-orm";

export default async function addItemToWishlist(req: Request, res: Response) {
  const { userId } = authUserInfo(res);
  const itemIdParserResult = z
    .int()
    .safeParse(parseInt(req.params.id as string));
  if (!itemIdParserResult.success) {
    throw new OperationFailedError("Invalid item id");
  }
  const alreadyExistInWishlist = await db
    .select()
    .from(wishlists)
    .where(
      and(
        eq(wishlists.user_id, userId),
        eq(wishlists.item_id, itemIdParserResult.data),
      ),
    );
  if (alreadyExistInWishlist.length) {
    throw new AlreadyExistError("Item Already exists in the wishlist");
  }

  const newWishlist = await db
    .insert(wishlists)
    .values({ user_id: userId, item_id: itemIdParserResult.data })
    .returning();
  return res.status(HTTP_STATUS_CODES.created).json({ data: newWishlist[0] });
}
