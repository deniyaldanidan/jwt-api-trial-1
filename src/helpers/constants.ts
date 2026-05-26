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

export const HTTP_STATUS_CODES = {
  success: 200,
  created: 201,
  badRequest: 400,
  internalServerErr: 500,
  conflict: 409,
  unauthorized: 401,
  notFound: 404,
  forbidden: 409,
} as const;

export const API_PATHS = {
  itemCategory: {
    base: "/item-category",
    addItemCategory: "/add", // final will be => base + addItemCategory => /item-category/add
  },
  auth: {
    base: "/auth",
    signIn: "/sign-in",
    signUp: "/sign-up",
    refresh: "/refresh",
    logout: "/logout",
  },
} as const;

export const REFRESH_COOKIE_NAME = "refresh";
