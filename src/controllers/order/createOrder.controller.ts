import { Request, Response } from "express";
import { authUserInfo } from "../../helpers/auth";
import db from "../../db/db";
import { carts, items, orderItems, orders } from "../../db/schema";
import { eq } from "drizzle-orm";
import { OperationFailedError } from "../../helpers/CustomErrors";
import { HTTP_STATUS_CODES, orderStatusObj } from "../../helpers/constants";

export default async function createOrderController(_: Request, res: Response) {
  const { userId: user_id } = authUserInfo(res);
  // Get Cart-Items
  const userCartItems = await db
    .select()
    .from(carts)
    .where(eq(carts.user_id, user_id))
    .leftJoin(items, eq(items.id, carts.item_id));
  // If empty, Send an error saying Cart is EMPTY
  if (!userCartItems.length) {
    throw new OperationFailedError("User cart is empty");
  }
  // If not empty, Calculate total_price => Create-order => Create order-items => Empty-out Cart
  const total_price = userCartItems.reduce((accumulator, currentVal) => {
    return (
      accumulator +
      (currentVal.item?.price as number) * (currentVal.cart.count as number)
    );
  }, 0);

  // Creating Order
  const currentDate = new Date();
  const createdOrderResult = await db
    .insert(orders)
    .values({
      user_id,
      status: orderStatusObj.created,
      total_price,
      created: currentDate,
    })
    .returning();

  const createdOrder = createdOrderResult[0];

  if (!createdOrder) {
    throw new Error("Unknown error happened while creating new order");
  }
  // Creating Order-items
  const currOrderItems = userCartItems.map((itm) => ({
    order_id: createdOrder.id,
    item_id: itm.cart.item_id,
    count: itm.cart.count,
  }));

  await db.insert(orderItems).values(currOrderItems);

  // Empty out the Cart
  await db.delete(carts).where(eq(carts.user_id, user_id));

  return res.sendStatus(HTTP_STATUS_CODES.created);
}
