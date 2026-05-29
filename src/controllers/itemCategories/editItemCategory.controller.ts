import { Request, Response } from "express";
import { editItemCategoryZodSchema } from "../../zodSchema/itemCategorySchema";
import { slugify } from "../../helpers/helpers";
import db from "../../db/db";
import { itemCategories } from "../../db/schema";
import { and, eq, ne } from "drizzle-orm";
import {
  AlreadyExistError,
  ResourceNotFoundError,
} from "../../helpers/CustomErrors";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function editItemCategoryController(
  req: Request,
  res: Response,
) {
  const parsedData = editItemCategoryZodSchema.parse(req.body);
  // find out if an item-category with this ID already exist or not?
  const foundItemCategoryById = await db
    .select()
    .from(itemCategories)
    .where(eq(itemCategories.id, parsedData.id));
  if (!foundItemCategoryById.length) {
    throw new ResourceNotFoundError();
  }

  // using name & id find out if an another category with the same NAME but different ID exist or not
  const catSlug = slugify(parsedData.name);
  const foundItemCategoryBySlugNID = await db
    .select()
    .from(itemCategories)
    .where(
      and(
        eq(itemCategories.slug, catSlug),
        ne(itemCategories.id, parsedData.id),
      ),
    );
  if (foundItemCategoryBySlugNID.length) {
    throw new AlreadyExistError("Category already exist with an different id");
  }
  // update the category
  await db
    .update(itemCategories)
    .set({ name: parsedData.name, slug: catSlug })
    .where(eq(itemCategories.id, parsedData.id));

  return res.status(HTTP_STATUS_CODES.success).json({ success: true });
}
