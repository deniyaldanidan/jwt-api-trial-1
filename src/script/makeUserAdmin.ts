import { eq } from "drizzle-orm";
import db from "../db/db";
import { users } from "../db/schema";
import { userRolesObj } from "../helpers/constants";

async function makeUserAdmin(username: string) {
  //   const flagIndex = process.argv.indexOf("--username");

  //   if (flagIndex < 0) {
  //     throw new Error("Flag not present");
  //   }

  //   const username = process.argv[flagIndex + 1];
  //   if (!username) {
  //     throw new Error("username value is not provided");
  //   }

  if (!username.length) {
    throw new Error("Username is not provided");
  }

  console.log(`updating user:${username} as admin`);
  await db
    .update(users)
    .set({ role: userRolesObj.admin })
    .where(eq(users.username, username));
}

makeUserAdmin("mr_admin");
