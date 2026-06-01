import z from "zod";
import { orderStatusObj } from "../helpers/constants";

const allowedOrderStatusArr = [
  orderStatusObj.confirmed,
  orderStatusObj.delivered,
  orderStatusObj.packing,
  orderStatusObj.returned,
  orderStatusObj.shipped,
];

export const changeOrderStatusZodSchema = z.object({
  orderId: z.string(),
  status: z.enum(allowedOrderStatusArr, {
    error: `Invalid Order Status, only "${allowedOrderStatusArr.join('", "')}" are allowed`,
  }),
});
