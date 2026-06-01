import { Request, Response } from "express";
import z from "zod";
import {
  OperationFailedError,
  ResourceNotFoundError,
} from "../../helpers/CustomErrors";
import db from "../../db/db";
import { itemCategories, items, orderItems, orders } from "../../db/schema";
import { eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function adminViewOrderController(
  req: Request,
  res: Response,
) {
  const orderIdParser = z.string().safeParse(req.params.id);
  if (!orderIdParser.success) {
    throw new OperationFailedError("Invalid Order ID");
  }

  const orderId = orderIdParser.data;
  const foundOrder = await db
    .select({
      order: orders,
      ordered_item: {
        ...orderItems,
        item: { ...items, category: itemCategories },
      },
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .leftJoin(orderItems, eq(orderItems.order_id, orders.id))
    .leftJoin(items, eq(items.id, orderItems.item_id))
    .leftJoin(itemCategories, eq(itemCategories.id, items.category_id));

  if (!foundOrder.length) {
    throw new ResourceNotFoundError("Requested order not found");
  }

  //  If order has only one order_item then reduce won't work...
  if (foundOrder.length === 1) {
    const formattedOrder = {
      order: foundOrder[0]?.order,
      order_items: [foundOrder[0]?.ordered_item],
    };
    return res.status(HTTP_STATUS_CODES.success).json(formattedOrder);
  }

  const reducedOrder = foundOrder.reduce((prev, curr) => {
    if (!(prev as any).order_items) {
      // First loop where prev.order_items is an empty value
      const currentOrder: any = prev.order;
      currentOrder.order_items = [];
      currentOrder.order_items[0] = prev.ordered_item;
      currentOrder.order_items[1] = curr.ordered_item;
      return currentOrder;
    } else {
      (prev as any).order_items.push(curr.ordered_item);
      return prev;
    }
  });

  return res.status(HTTP_STATUS_CODES.success).json(reducedOrder);
}
