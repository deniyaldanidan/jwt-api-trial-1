import { Request, Response } from "express";
import { addItemCategoryZodSchema } from "../../zodSchema/itemCategorySchema";
import db from "../../db/db";
import { itemCategories } from "../../db/schema";
import { slugify } from "../../helpers/helpers";
import { HTTP_STATUS_CODES } from "../../helpers/constants";
import { eq } from "drizzle-orm";
import { AlreadyExistError } from "../../helpers/CustomErrors";

export default async function addItemCategoryController(
  req: Request,
  res: Response,
) {
  const parsedData = addItemCategoryZodSchema.parse(req.body);
  const catSlug = slugify(parsedData.name);
  // See, If category already exists
  const existedCategory = await db
    .select()
    .from(itemCategories)
    .where(eq(itemCategories.slug, catSlug));
  if (existedCategory.length) {
    throw new AlreadyExistError("Requested Item-Category already exists.");
  }

  // Else create new category
  const newCategory = await db
    .insert(itemCategories)
    .values({ name: parsedData.name, slug: catSlug })
    .returning();
  return res.status(HTTP_STATUS_CODES.created).json(newCategory);
}
