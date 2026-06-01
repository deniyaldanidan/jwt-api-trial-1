import { Request, Response } from "express";
import { authUserInfo } from "../../helpers/auth";
import userLocationZodSchema from "../../zodSchema/userlocationSchema";
import db from "../../db/db";
import { userAddresses } from "../../db/schema";
import { eq } from "drizzle-orm";
import { HTTP_STATUS_CODES } from "../../helpers/constants";

export default async function editUserLocationController(
  req: Request,
  res: Response,
) {
  const { userId } = authUserInfo(res);
  // parse the data
  const locationData = userLocationZodSchema.parse(req.body);

  // See if location-info already present
  const foundLocationInfo = await db
    .select()
    .from(userAddresses)
    .where(eq(userAddresses.user_id, userId));

  // If it is edit the data
  if (foundLocationInfo.length) {
    await db
      .update(userAddresses)
      .set(locationData)
      .where(eq(userAddresses.user_id, userId));
  } else {
    // If not create-new location-info
    await db.insert(userAddresses).values({ ...locationData, user_id: userId });
  }

  // success-response
  return res.sendStatus(HTTP_STATUS_CODES.success);
}
