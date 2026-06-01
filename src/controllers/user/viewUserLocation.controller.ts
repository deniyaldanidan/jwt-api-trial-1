import { Request, Response } from "express";
import { authUserInfo } from "../../helpers/auth";
import db from "../../db/db";
import { userAddresses } from "../../db/schema";
import { eq } from "drizzle-orm";
import { ResourceNotFoundError } from "../../helpers/CustomErrors";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function viewUserLocationController(
  req: Request,
  res: Response,
) {
  const { userId } = authUserInfo(res);
  const foundLocationInfo = await db
    .select()
    .from(userAddresses)
    .where(eq(userAddresses.user_id, userId));
  if (!foundLocationInfo.length) {
    return res.status(HTTP_STATUS_CODES.success).json({});
  }
  return res.status(HTTP_STATUS_CODES.success).json(foundLocationInfo[0]);
}
