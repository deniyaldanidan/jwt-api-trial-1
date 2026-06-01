import { Request, Response } from "express";
import { authUserInfo } from "../../helpers/auth";
import db from "../../db/db";
import { items, orderItems, orders } from "../../db/schema";
import { eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

type FormattedOrderType = typeof orders.$inferSelect & {
  order_items?: Array<
    typeof orderItems.$inferSelect & { item?: typeof items.$inferSelect }
  >;
};

export default async function adminViewAllOrdersController(
  _: Request,
  res: Response,
) {
  const foundOrders = await db
    .select({
      order: orders,
      order_item: { ...orderItems, item: { ...items } },
    })
    .from(orders)
    .leftJoin(orderItems, eq(orderItems.order_id, orders.id))
    .leftJoin(items, eq(items.id, orderItems.item_id));

  const formattedOrders: FormattedOrderType[] = [];

  for (let i = 0; i < foundOrders.length; i++) {
    let curr: any = structuredClone(foundOrders[i]); // using structuredClone to avoid damaging original Orders-Obj
    // console.log(curr);
    const orderIndex = formattedOrders.findIndex(
      (val) => val.id == curr.order.id,
    );
    if (orderIndex !== -1) {
      if (!formattedOrders[orderIndex]?.order_items) {
        (formattedOrders[orderIndex] as any)["order_items"] = [];
      }
      (formattedOrders[orderIndex] as any).order_items.push(curr.order_item);
    } else {
      const newOrder: FormattedOrderType = curr.order;
      newOrder.order_items = [];
      newOrder.order_items[0] = curr?.order_item as any;
      formattedOrders.push(curr.order);
    }
  }

  return res.status(HTTP_STATUS_CODES.success).json(formattedOrders);
}
