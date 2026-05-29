import { Request, Response } from "express";
import { addItemZodSchema } from "../../zodSchema/itemSchema";
import db from "../../db/db";
import { items } from "../../db/schema";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

/**
 *
 * @notice This Controller requires ForeignKeyConstraintErrHandler
 */
export default async function addItemController(req: Request, res: Response) {
  // sanitize the data
  const data = addItemZodSchema.parse(req.body);
  // create item in DB
  const newItem = await db
    .insert(items)
    .values({ ...data })
    .returning();

  if (!newItem.length) {
    throw new Error("Unknown error happened while creating new Item");
  }
  return res.status(HTTP_STATUS_CODES.created).json({ item: newItem[0] });
}
