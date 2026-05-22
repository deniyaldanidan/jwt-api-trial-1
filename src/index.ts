import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";

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

// APP.LISTEN
app.listen(PORT, () => {
  console.log(`API is running on port: ${PORT}`);
});
