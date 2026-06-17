const {
  SERVER_APP_PORT = "7800",
  SERVER_REDIRECTION = "DEV",
} = process.env;

export const env = {
  SERVER_APP_PORT: Number(SERVER_APP_PORT),
  SERVER_REDIRECTION,
};
