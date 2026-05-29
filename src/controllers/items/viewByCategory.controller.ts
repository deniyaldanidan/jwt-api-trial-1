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

export default async function viewByCategoryController(
  req: Request,
  res: Response,
) {
  const catIdParserResult = z
    .int()
    .safeParse(parseInt(req.params.catid as string));
  if (!catIdParserResult.success) {
    throw new OperationFailedError("Invalid category id");
  }
  const categoryId = catIdParserResult.data;
  const dbResult = await db
    .select()
    .from(itemCategories)
    .where(eq(itemCategories.id, categoryId))
    .leftJoin(items, eq(items.category_id, itemCategories.id));

  if (!dbResult.length) {
    throw new ResourceNotFoundError("Requested Category Id not found");
  }

  const categoriesData = dbResult[0]?.category;
  const itemsData = dbResult.map((dt) => dt.item);

  return res
    .status(HTTP_STATUS_CODES.success)
    .json({ data: { category: categoriesData, items: itemsData } });
}
