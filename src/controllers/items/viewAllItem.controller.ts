import { Request, Response } from "express";
import db from "../../db/db";
import { itemCategories, items } from "../../db/schema";
import { eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function viewAllItemController(_: Request, res: Response) {
  const dbResult = await db
    .select({
      id: items.id,
      name: items.name,
      price: items.price,
      description: items.description,
      item_qty: items.item_qty,
      item_unit: items.item_unit,
      veg: items.veg,
      category: {
        cat_id: itemCategories.id,
        cat_name: itemCategories.name,
        cat_slug: itemCategories.slug,
      },
    })
    .from(items)
    .leftJoin(itemCategories, eq(items.category_id, itemCategories.id));

  return res.status(HTTP_STATUS_CODES.success).json({ data: dbResult });
}
