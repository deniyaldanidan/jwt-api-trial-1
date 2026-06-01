import { Request, Response } from "express";
import { changeOrderStatusZodSchema } from "../../zodSchema/changeOrderStatusSchema";
import { orders } from "../../db/schema";
import db from "../../db/db";
import { eq } from "drizzle-orm";
import {
  OperationFailedError,
  ResourceNotFoundError,
} from "../../helpers/CustomErrors";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function changeOrderStatusController(
  req: Request,
  res: Response,
) {
  const { orderId, status: orderStatus } = changeOrderStatusZodSchema.parse({
    orderId: req.params?.id,
    status: req.params?.status,
  });

  const foundOrder = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId));

  if (!foundOrder.length) {
    throw new ResourceNotFoundError("Requested order not found!");
  }

  if (foundOrder[0]?.status == "cancelled") {
    throw new OperationFailedError(
      "Order is Cancelled, Can't change its status",
    );
  }

  const currDate = new Date();

  const setValue: Partial<typeof orders.$inferInsert> = {};

  switch (orderStatus) {
    case "confirmed":
      setValue.status = "confirmed";
      break;
    case "delivered":
      setValue.status = "delivered";
      setValue.delivered = currDate;
      break;
    case "packing":
      setValue.status = "packing";
      break;
    case "returned":
      setValue.status = "returned";
      setValue.returned = currDate;
      break;
    case "shipped":
      setValue.status = "shipped";
      setValue.shipped = currDate;
      break;
  }
  console.log(setValue);
  await db.update(orders).set(setValue).where(eq(orders.id, orderId));

  return res.sendStatus(HTTP_STATUS_CODES.success);
}
