export const userRolesEnum = ["1452", "9571"] as const;

export const userRolesObj = {
  user: userRolesEnum[0],
  admin: userRolesEnum[1],
} as const; // 1452 => user   9571 => admin

export const orderStatusEnum = [
  "created",
  "confirmed",
  "packing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
] as const;

type UserRoleType = (typeof userRolesEnum)[number];
