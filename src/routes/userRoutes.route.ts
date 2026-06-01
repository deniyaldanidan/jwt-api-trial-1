import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import { API_PATHS, userRolesObj } from "../helpers/constants";
import viewUserLocationController from "../controllers/user/viewUserLocation.controller";
import editUserLocationController from "../controllers/user/editUserLocation.controller";
import deleteUserController from "../controllers/user/deleteUser.controller";

const userRouter = express.Router();

userRouter.use(authMiddleware([userRolesObj.user]));

userRouter.get(API_PATHS.user.location.view, viewUserLocationController);
userRouter.post(API_PATHS.user.location.edit, editUserLocationController);
userRouter.delete(API_PATHS.user.delete, deleteUserController);

export default userRouter;
