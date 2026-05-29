import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import { API_PATHS, userRolesObj } from "../helpers/constants";
import addItemToCartController from "../controllers/cart/addItemToCart.controller";
import foreignKeyConstraintErrHandler from "../middleware/foreignKeyConstraintErrHandler.middleware";
import viewCartController from "../controllers/cart/viewCart.controller";
import removeItemFromCartController from "../controllers/cart/removeItemFromCart.controller";
import clearCartController from "../controllers/cart/clearCart.controller";

const cartRouter = express.Router();
// Only people with user-role can access this router
cartRouter.use(authMiddleware([userRolesObj.user]));

cartRouter.post(
  API_PATHS.cart.add,
  addItemToCartController,
  foreignKeyConstraintErrHandler("Requested resource doesn't exist!"),
);
cartRouter.put(API_PATHS.cart.remove, removeItemFromCartController);
cartRouter.delete(API_PATHS.cart.clear, clearCartController);

cartRouter.get(API_PATHS.cart.view, viewCartController);

export default cartRouter;
