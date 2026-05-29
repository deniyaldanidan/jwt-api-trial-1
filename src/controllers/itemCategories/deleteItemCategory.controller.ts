import { Request, Response } from "express";
import z from "zod";
import {
  OperationFailedError,
  ResourceNotFoundError,
} from "../../helpers/CustomErrors";
import db from "../../db/db";
import { itemCategories } from "../../db/schema";
import { eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function deleteItemCategoryController(
  req: Request,
  res: Response,
) {
  const catIdParsedResult = z
    .int()
    .safeParse(parseInt((req.params.id as string) || ""));
  if (!catIdParsedResult.success) {
    throw new OperationFailedError("Incorrect Request");
  }
  const catId = catIdParsedResult.data;

  // Check if the Category is already present in the DB
  const foundCategory = await db
    .select()
    .from(itemCategories)
    .where(eq(itemCategories.id, catId));
  if (!foundCategory.length) {
    throw new ResourceNotFoundError();
  }

  await db.delete(itemCategories).where(eq(itemCategories.id, catId));
  return res.sendStatus(HTTP_STATUS_CODES.success);
}
