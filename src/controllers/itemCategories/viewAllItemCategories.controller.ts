import { Request, Response } from "express";
import db from "../../db/db";
import { itemCategories } from "../../db/schema";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function viewAllItemCategoriesController(
  _: Request,
  res: Response,
) {
  const cats = await db.select().from(itemCategories);

  return res.status(HTTP_STATUS_CODES.success).json({ data: cats });
}
