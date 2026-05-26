import express from "express";
import { API_PATHS, userRolesObj } from "../helpers/constants";
import addItemCategoryController from "../controllers/itemCategories/addItemCategory.controller";
import zodValidationErrHandler from "../middleware/zodValidationErrHandler.middleware";
import alreadyExistErrHandler from "../middleware/alreadyExistErrHandler.middleware";
import authMiddleware from "../middleware/auth.middleware";

const itemCategoriesRouter = express.Router();

itemCategoriesRouter.post(
  API_PATHS.itemCategory.addItemCategory,
  authMiddleware([userRolesObj["admin"]]),
  addItemCategoryController,
  alreadyExistErrHandler,
);

itemCategoriesRouter.use(zodValidationErrHandler);

export default itemCategoriesRouter;
