import { Request, Response } from "express";
import z from "zod";
import {
  OperationFailedError,
  ResourceNotFoundError,
} from "../../helpers/CustomErrors";
import db from "../../db/db";
import { itemCategories, items } from "../../db/schema";
import { eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function viewOneItemController(
  req: Request,
  res: Response,
) {
  const itemIdParsedResult = z
    .int()
    .safeParse(parseInt((req.params.id as string) || ""));
  if (!itemIdParsedResult.success) {
    throw new OperationFailedError("Invalid ID");
  }
  const itemId = itemIdParsedResult.data;

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
    .where(eq(items.id, itemId))
    .leftJoin(itemCategories, eq(itemCategories.id, items.category_id));

  if (!dbResult.length) {
    throw new ResourceNotFoundError("Requested Item not Found!");
  }
  return res.status(HTTP_STATUS_CODES.success).json({ data: dbResult[0] });
}
