import { Request, Response } from "express";
import { editItemZodSchema } from "../../zodSchema/itemSchema";
import db from "../../db/db";
import { items } from "../../db/schema";
import { eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";
// import { DrizzleQueryError } from "drizzle-orm";
// import { LibsqlError } from "@libsql/client";
import { ResourceNotFoundError } from "../../helpers/CustomErrors";

/**
 *
 * @param req Request
 * @param res Response Object
 * @notice This controller needs ForeignKeyConstraintErrHandler Middleware
 */
export default async function editItemController(req: Request, res: Response) {
  const data = editItemZodSchema.parse(req.body);
  //   try {
  const result = await db
    .update(items)
    .set({
      name: data.name,
      description: data.description,
      category_id: data.category_id,
      item_qty: data.item_qty,
      item_unit: data.item_unit,
      price: data.price,
      veg: data.veg,
    })
    .where(eq(items.id, data.id))
    .returning();

  if (!result.length) {
    throw new ResourceNotFoundError("Requested item not found");
  }

  return res.status(HTTP_STATUS_CODES.success).json({ data: result });
  /*  
} catch (error) {
    if (error instanceof DrizzleQueryError) {
      if (error.cause instanceof LibsqlError) {
        if (error.cause.rawCode == 787) {
          throw new ResourceNotFoundError("Requested Category not found");
        }
      }
    }
    throw new Error("Error happened");
  }
    */
}
