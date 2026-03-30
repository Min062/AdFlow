import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";
import { adRouter } from "./routes/ad-routes.js";
import { authRouter } from "./routes/auth-routes.js";
import { metaRouter } from "./routes/meta-routes.js";
import { reportRouter } from "./routes/report-routes.js";
import { sdkRouter } from "./routes/sdk-routes.js";
import { siteRouter } from "./routes/site-routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: false
    })
  );
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/sdk", express.static(path.resolve(__dirname, "../../../packages/player-sdk/dist")));
  app.use("/api", metaRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/sites", siteRouter);
  app.use("/api/ads", adRouter);
  app.use("/api/reports", reportRouter);
  app.use("/sdk", sdkRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
