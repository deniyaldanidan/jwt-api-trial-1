import express from "express";
import { API_PATHS, userRolesObj } from "../helpers/constants";
import addItemCategoryController from "../controllers/itemCategories/addItemCategory.controller";
import authMiddleware from "../middleware/auth.middleware";
import editItemCategoryController from "../controllers/itemCategories/editItemCategory.controller";
import deleteItemCategoryController from "../controllers/itemCategories/deleteItemCategory.controller";

const itemCategoriesRouter = express.Router();

// Auth-Middleware only allowing Admin's. So all the routes below will only be accessed by ADMIN
itemCategoriesRouter.use(authMiddleware([userRolesObj["admin"]]));

itemCategoriesRouter.post(
  API_PATHS.itemCategory.addItemCategory,
  addItemCategoryController,
);

itemCategoriesRouter.put(
  API_PATHS.itemCategory.editItemCategory,
  editItemCategoryController,
);

itemCategoriesRouter.delete(
  API_PATHS.itemCategory.deleteItemCategory,
  deleteItemCategoryController,
);

export default itemCategoriesRouter;
