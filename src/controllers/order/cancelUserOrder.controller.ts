import { Request, Response } from "express";
import { authUserInfo } from "../../helpers/auth";
import z from "zod";
import {
  OperationFailedError,
  ResourceNotFoundError,
} from "../../helpers/CustomErrors";
import db from "../../db/db";
import { orders } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function cancelUserOrderController(
  req: Request,
  res: Response,
) {
  const { userId } = authUserInfo(res);
  const orderIdParser = z.string().safeParse(req.params.id);
  if (!orderIdParser.success) {
    throw new OperationFailedError("Invalid order id");
  }
  const orderId = orderIdParser.data;
  const foundOrder = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.user_id, userId)));

  if (!foundOrder.length) {
    throw new ResourceNotFoundError("Requested order not found!");
  }

  if (foundOrder[0]?.status === "cancelled") {
    return res
      .status(HTTP_STATUS_CODES.success)
      .json({ msg: "Order is already cancelled" });
  }

  if (foundOrder[0]?.status !== "created") {
    throw new OperationFailedError(
      `Order is already confirmed and its status is ${foundOrder[0]?.status}`,
    );
  }

  const currDate = new Date();
  await db
    .update(orders)
    .set({ cancelled: currDate, status: "cancelled" })
    .where(and(eq(orders.id, orderId), eq(orders.user_id, userId)));
  return res.sendStatus(HTTP_STATUS_CODES.success);
}
