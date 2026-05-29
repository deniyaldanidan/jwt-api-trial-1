import express from "express";
import { API_PATHS, userRolesObj } from "../helpers/constants";
import viewWishlistController from "../controllers/wishlist/viewWishlist.controller";
import addItemToWishlist from "../controllers/wishlist/addItemToWishlist.controller";
import foreignKeyConstraintErrHandler from "../middleware/foreignKeyConstraintErrHandler.middleware";
import removeItemFromWishlistController from "../controllers/wishlist/removeItemFromWishlist.controller";
import authMiddleware from "../middleware/auth.middleware";

const wishlistRouter = express.Router();
wishlistRouter.use(authMiddleware([userRolesObj.user]));

wishlistRouter.get(API_PATHS.wishlist.view, viewWishlistController);
wishlistRouter.post(
  API_PATHS.wishlist.add,
  addItemToWishlist,
  foreignKeyConstraintErrHandler("Requested resource doesn't exist!"),
);
wishlistRouter.delete(
  API_PATHS.wishlist.remove,
  removeItemFromWishlistController,
);

export default wishlistRouter;
