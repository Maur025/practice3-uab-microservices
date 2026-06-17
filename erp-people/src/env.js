const {
  SERVER_APP_PORT = "7802",
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_USER = "root",
  DB_PASSWORD = "",
  DB_NAME = "sistema_supermercado_db",
  INSTANCE_ID,
} = process.env;

export const env = {
  SERVER_APP_PORT: Number(SERVER_APP_PORT),
  DB_HOST: DB_HOST,
  DB_PORT: Number(DB_PORT),
  DB_USER: DB_USER,
  DB_PASSWORD: DB_PASSWORD,
  DB_NAME,
  INSTANCE_ID,
};
