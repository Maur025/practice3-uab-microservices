import "dotenv/config";
import { env } from "./env.js";
import express from "express";
import compression from "compression";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { loggerInfo } from "@maur025/core-logger";
import { apiRouter } from "./routes/api.routes.js";
import { initializeDb } from "./db.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { openApiSpec } from "./swagger.js";

const apiPrefix = "/api/personas";

const app = express();
app.use(compression());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(express.json({ limit: "25mb" }));
app.use(express.text({ limit: "25mb" }));
app.use(
  express.urlencoded({
    extended: true,
    parameterLimit: 100_000,
    limit: "50mb",
  }),
);

initializeDb();

console.log({ instanceId: env.INSTANCE_ID });

app.use("/health", (req, res) => res.status(200).send("OK"));
app.get(`${apiPrefix}/openapi.json`, (req, res) => res.json(openApiSpec));
app.use(`${apiPrefix}/docs`, swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use(apiPrefix, apiRouter);
app.use(errorMiddleware);

app.listen(env.SERVER_APP_PORT, () => {
  loggerInfo(`[SERVER] Server is running on port ${env.SERVER_APP_PORT}`);
});
