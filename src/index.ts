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

app.use(API_PATHS.itemCategory.base, itemCategoriesRouter);
app.use(API_PATHS.auth.base, authRouter);

// APP-Level-Error Handlers
app.use(jsonParseErrHandler);
app.use(unauthorizedErrorHandler);
app.use(forbiddedErrHandler);
authRouter.use(zodValidationErrHandler);

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
