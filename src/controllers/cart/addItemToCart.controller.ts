import { Request, Response } from "express";
import { addItemToCartZodSchema } from "../../zodSchema/cartSchema";
import db from "../../db/db";
import { carts } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { authUserInfo } from "../../helpers/auth";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function addItemToCartController(
  req: Request,
  res: Response,
) {
  const cartItem = addItemToCartZodSchema.parse(req.body);
  const { userId } = authUserInfo(res);

  // Check if the Item Does exist

  const foundCartItem = await db
    .select()
    .from(carts)
    .where(and(eq(carts.user_id, userId), eq(carts.item_id, cartItem.item_id)));

  // If it does, Change the count
  if (foundCartItem.length) {
    await db
      .update(carts)
      .set({ count: cartItem.count })
      .where(
        and(eq(carts.user_id, userId), eq(carts.item_id, cartItem.item_id)),
      );
  } else {
    // If it doesn't, Create new Cart-Item
    await db.insert(carts).values({
      user_id: userId,
      item_id: cartItem.item_id,
      count: cartItem.count,
    });
  }
  return res.sendStatus(HTTP_STATUS_CODES.created);
}
