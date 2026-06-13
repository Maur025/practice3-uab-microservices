import "dotenv/config";
import { env } from "./env.js";
import express from "express";
import compression from "compression";
import cors from "cors";
import { loggerInfo } from "@maur025/core-logger";
// import { router } from "./routes/index.js";

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
// app.use(router);

app.listen(env.SERVER_APP_PORT, () => {
  loggerInfo(`[SERVER] Server is running on port ${env.SERVER_APP_PORT}`);
});
