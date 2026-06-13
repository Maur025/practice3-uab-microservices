import mysql from "mysql2/promise";
import { env } from "./env.js";
import { loggerInfo } from "@maur025/core-logger";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = env;

let db;

export const initializeDb = () => {
  db = mysql
    .createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    })
    .on("connection", () => {
      loggerInfo(
        `[DB] Database connection pool created for ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      );
    });
};

export { db };
