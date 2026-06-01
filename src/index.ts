import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { API_PATHS, HTTP_STATUS_CODES } from "./helpers/constants";
import itemCategoriesRouter from "./routes/itemCategoriesRoutes.route";
import jsonParseErrHandler from "./middleware/jsonParseErrHandler.middleware";
import masterErrHandler from "./middleware/masterErrHandler.middleware";
import unauthorizedErrorHandler from "./middleware/unauthorizedErrHandler.middleware";
import authRouter from "./routes/authRoutes.route";
import zodValidationErrHandler from "./middleware/zodValidationErrHandler.middleware";
import forbiddedErrHandler from "./middleware/forbiddenErrHandler.middleware";
import resourceNotFoundErrHandler from "./middleware/resourceNotFoundErrHandler.middleware";
import alreadyExistErrHandler from "./middleware/alreadyExistErrHandler.middleware";
import operationFailedErrHandler from "./middleware/operationFailedErrHandler.middleware";
import itemRouter from "./routes/itemRoutes.route";
import cartRouter from "./routes/cartRoutes.route";
import wishlistRouter from "./routes/wishlistsRoutes.route";
import userRouter from "./routes/userRoutes.route";
import userOnlyOrderRouter from "./routes/userOnlyOrderRoutes.route";
import adminOnlyOrderRoutes from "./routes/adminOnlyOrderRoutes.route";

const app = express();

const PORT = process.env?.PORT ?? 3000;

// MIDDLEWARE STARTS HERE
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * API Code Comes HERE
 *
 */

app.use(API_PATHS.auth.base, authRouter);
app.use(API_PATHS.itemCategory.base, itemCategoriesRouter);
app.use(API_PATHS.item.base, itemRouter);
app.use(API_PATHS.cart.base, cartRouter);
app.use(API_PATHS.wishlist.base, wishlistRouter);
app.use(API_PATHS.user.base, userRouter);
app.use(API_PATHS.order.base, userOnlyOrderRouter);
app.use(API_PATHS.order.adminOnlyBase, adminOnlyOrderRoutes);

// APP-Level-Error Handlers
app.use(jsonParseErrHandler);
app.use(unauthorizedErrorHandler);
app.use(forbiddedErrHandler);
app.use(zodValidationErrHandler);
app.use(resourceNotFoundErrHandler);
app.use(alreadyExistErrHandler);
app.use(operationFailedErrHandler);

// Master-Error Handler
app.use(masterErrHandler);

// 404-handler
app.use((req, res, __) => {
  return res
    .status(HTTP_STATUS_CODES.notFound)
    .send(`Sorry, Requested resource "${req.method}:${req.path}" NOT FOUND!`);
});

// APP.LISTEN
app.listen(PORT, () => {
  console.log(`API is running on port: ${PORT}`);
});
