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

export const orderStatusObj = {
  created: orderStatusEnum[0],
  confirmed: orderStatusEnum[1],
  packing: orderStatusEnum[2],
  shipped: orderStatusEnum[3],
  delivered: orderStatusEnum[4],
  cancelled: orderStatusEnum[5],
  returned: orderStatusEnum[6],
};

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
    editItemCategory: "/edit",
    deleteItemCategory: "/delete/:id",
  },
  auth: {
    base: "/auth",
    signIn: "/sign-in",
    signUp: "/sign-up",
    refresh: "/refresh",
    logout: "/logout",
  },
  item: {
    base: "/item",
    add: "/create",
    view: {
      listAll: "/view/all",
      byCategory: "/view/category/:catid",
      one: "/view/:id",
    },
    edit: "/edit",
    delete: "/delete/:id",
  },
  cart: {
    base: "/cart",
    add: "/add",
    remove: "/remove/",
    clear: "/clear",
    view: "/view",
  },
  wishlist: {
    base: "/wishlist",
    add: "/add/:id",
    remove: "/remove/:id",
    view: "/view",
  },
  user: {
    base: "/user",
    location: {
      view: "/location/view",
      edit: "/location/edit",
    },
    delete: "/delete-me",
  },
  order: {
    base: "/order",
    create: "/create",
    viewAll: "/view/all",
    viewOne: "/view/:id",
    cancel: "/cancel/:id",
    adminOnlyBase: "/admin/order",
    changeOrderStatus: "/change-status/:id/:status",
  },
} as const;

export const REFRESH_COOKIE_NAME = "refresh";
