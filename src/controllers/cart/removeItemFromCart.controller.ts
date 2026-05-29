import { Request, Response } from "express";
import { removeItemFromCartZodSchema } from "../../zodSchema/cartSchema";
import { authUserInfo } from "../../helpers/auth";
import db from "../../db/db";
import { carts } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function removeItemFromCart(req: Request, res: Response) {
  const { userId } = authUserInfo(res);
  const cartItem = removeItemFromCartZodSchema.parse(req.body);

  if (cartItem.count === 0) {
    await db
      .delete(carts)
      .where(
        and(eq(carts.item_id, cartItem.item_id), eq(carts.user_id, userId)),
      );
  } else {
    await db
      .update(carts)
      .set({ count: cartItem.count })
      .where(
        and(eq(carts.item_id, cartItem.item_id), eq(carts.user_id, userId)),
      );
  }

  return res.sendStatus(HTTP_STATUS_CODES.success);
}
