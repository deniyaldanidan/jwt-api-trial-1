import express from "express";
import { API_PATHS } from "../helpers/constants";
import signUpController from "../controllers/auth/signUp.controller";
import alreadyExistErrHandler from "../middleware/alreadyExistErrHandler.middleware";
import signInController from "../controllers/auth/signIn.controller";
import logoutController from "../controllers/auth/logout.controller";
import refreshController from "../controllers/auth/refresh.controller";
// import zodValidationErrHandler from "../middleware/zodValidationErrHandler.middleware";

const authRouter = express.Router();

authRouter.post(
  API_PATHS.auth.signUp,
  signUpController,
  alreadyExistErrHandler,
);
authRouter.post(API_PATHS.auth.signIn, signInController);
authRouter.put(API_PATHS.auth.logout, logoutController);
authRouter.put(API_PATHS.auth.refresh, refreshController);

export default authRouter;
