import { Request, Response } from "express";
import { authUserInfo } from "../../helpers/auth";
import db from "../../db/db";
import { itemCategories, items, wishlists } from "../../db/schema";
import { eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function viewWishlistController(
  _: Request,
  res: Response,
) {
  const { userId } = authUserInfo(res);
  const wishes = await db
    .select({
      id: wishlists.id,
      item: { ...items },
      itemCategory: { ...itemCategories },
    })
    .from(wishlists)
    .where(eq(wishlists.user_id, userId))
    .leftJoin(items, eq(items.id, wishlists.item_id))
    .leftJoin(itemCategories, eq(itemCategories.id, items.category_id));
  return res.status(HTTP_STATUS_CODES.success).json({ data: wishes });
}
