const {
	SERVER_APP_PORT = "7802",
	DB_HOST = "localhost",
	DB_PORT = "5432",
	DB_USER = "root",
	DB_PASSWORD = "password",
} = process.env;

export const env = {
	SERVER_APP_PORT: Number(SERVER_APP_PORT),
	DB_HOST: DB_HOST,
	DB_PORT: Number(DB_PORT),
	DB_USER: DB_USER,
	DB_PASSWORD: DB_PASSWORD,
};
