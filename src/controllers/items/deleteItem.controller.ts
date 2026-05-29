import { Request, Response } from "express";
import z from "zod";
import { OperationFailedError } from "../../helpers/CustomErrors";
import db from "../../db/db";
import { items } from "../../db/schema";
import { eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function deleteItemController(
  req: Request,
  res: Response,
) {
  const itemIdParserResult = z
    .int()
    .safeParse(parseInt(req.params.id as string));
  if (!itemIdParserResult.success) {
    throw new OperationFailedError("Invalid Item ID");
  }

  await db.delete(items).where(eq(items.id, itemIdParserResult.data));
  return res.sendStatus(HTTP_STATUS_CODES.success);
}
