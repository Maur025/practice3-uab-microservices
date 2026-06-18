import "dotenv/config";
import { env } from "./env.js";
import express from "express";
import compression from "compression";
import cors from "cors";
import { loggerInfo } from "@maur025/core-logger";
import { createProxyMiddleware } from "http-proxy-middleware";
import { configServices } from "./config-services.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
app.use(compression());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

Object.entries(configServices).forEach(([path, target]) => {
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: async (pathStr, req) => req.originalUrl,
      on: {
        proxyReq: (proxyReq) => {
          const host = proxyReq.getHeader("host");
          const finalPath = proxyReq.path;

          loggerInfo(`[PROXY] redirecting to -> http://${host}${finalPath}`);
        },
      },
    }),
  );
});

app.use(errorMiddleware);

app.listen(env.SERVER_APP_PORT, () => {
  loggerInfo(`[SERVER] Server is running on port ${env.SERVER_APP_PORT}`);
});
