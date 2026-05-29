import { Request, Response } from "express";
import { authUserInfo } from "../../helpers/auth";
import db from "../../db/db";
import { carts, itemCategories, items } from "../../db/schema";
import { eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function viewCartController(_: Request, res: Response) {
  const { userId } = authUserInfo(res);
  const foundItems = await db
    .select({
      id: carts.id,
      count: carts.count,
      item: { ...items },
      item_category: { ...itemCategories },
    })
    .from(carts)
    .where(eq(carts.user_id, userId))
    .leftJoin(items, eq(items.id, carts.item_id))
    .leftJoin(itemCategories, eq(itemCategories.id, items.category_id));

  return res.status(HTTP_STATUS_CODES.success).json({ data: foundItems });
}
