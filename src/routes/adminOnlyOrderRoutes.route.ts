import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import { API_PATHS, userRolesObj } from "../helpers/constants";
import changeOrderStatusController from "../controllers/order/changeOrderStatus.controller";
import adminViewAllOrdersController from "../controllers/order/adminViewAllOrders.controller";
import adminViewOrderController from "../controllers/order/adminViewOrder.controller";
import adminCancelOrderController from "../controllers/order/adminCancelOrder.controller";

const adminOnlyOrderRoutes = express.Router();
// Admin-Only Auth_Middleware
adminOnlyOrderRoutes.use(authMiddleware([userRolesObj.admin]));
// Routes
adminOnlyOrderRoutes.put(
  API_PATHS.order.changeOrderStatus,
  changeOrderStatusController,
);
adminOnlyOrderRoutes.get(API_PATHS.order.viewAll, adminViewAllOrdersController);
adminOnlyOrderRoutes.get(API_PATHS.order.viewOne, adminViewOrderController);
adminOnlyOrderRoutes.delete(API_PATHS.order.cancel, adminCancelOrderController);

export default adminOnlyOrderRoutes;
