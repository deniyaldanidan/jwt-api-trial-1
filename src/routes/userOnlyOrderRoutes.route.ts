import express from "express";
import { API_PATHS, userRolesObj } from "../helpers/constants";
import createOrderController from "../controllers/order/createOrder.controller";
import authMiddleware from "../middleware/auth.middleware";
import viewAllUserOrdersController from "../controllers/order/viewAllUserOrders.controller";
import viewUserOrderController from "../controllers/order/viewUserOrder.controller";
import cancelUserOrderController from "../controllers/order/cancelUserOrder.controller";

const userOnlyOrderRouter = express.Router();

// Only User's allowed
userOnlyOrderRouter.use(authMiddleware([userRolesObj.user]));

userOnlyOrderRouter.post(API_PATHS.order.create, createOrderController);
userOnlyOrderRouter.get(API_PATHS.order.viewAll, viewAllUserOrdersController);
userOnlyOrderRouter.get(API_PATHS.order.viewOne, viewUserOrderController);
userOnlyOrderRouter.delete(API_PATHS.order.cancel, cancelUserOrderController);

export default userOnlyOrderRouter;
