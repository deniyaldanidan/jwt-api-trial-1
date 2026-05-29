import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import { API_PATHS, userRolesObj } from "../helpers/constants";
import addItemController from "../controllers/items/addItem.controller";
import viewAllItemController from "../controllers/items/viewAllItem.controller";
import viewOneItemController from "../controllers/items/viewOneItem.controller";
import viewByCategoryController from "../controllers/items/viewByCategory.controller";
import editItemController from "../controllers/items/editItem.controller";
import foreignKeyConstraintErrHandler from "../middleware/foreignKeyConstraintErrHandler.middleware";
import deleteItemController from "../controllers/items/deleteItem.controller";

const itemRouter = express.Router();

// Guest routes
itemRouter.get(API_PATHS.item.view.listAll, viewAllItemController);
itemRouter.get(API_PATHS.item.view.byCategory, viewByCategoryController);
itemRouter.get(API_PATHS.item.view.one, viewOneItemController);

// Routes below are only accessible by the admin
itemRouter.use(authMiddleware([userRolesObj.admin]));

itemRouter.post(
  API_PATHS.item.add,
  addItemController,
  foreignKeyConstraintErrHandler("Requested Category not found!"),
);
itemRouter.put(
  API_PATHS.item.edit,
  editItemController,
  foreignKeyConstraintErrHandler("Requested Category not found!"),
);

itemRouter.delete(API_PATHS.item.delete, deleteItemController);

export default itemRouter;
