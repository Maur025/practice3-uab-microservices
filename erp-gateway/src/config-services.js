const { SERVER_REDIRECTION = "DEV" } = process.env;

const devServices = {
  "/api/compras": "http://localhost:7801",
  "/api/personas": "http://localhost:7802",
  "/api/inventarios": "http://localhost:7803",
  "/api/ventas": "http://localhost:7804",
  "/api/finanzas": "http://localhost:7805",
};

const prodServices = {
  "/api/compras": "http://purchase-service:80",
  "/api/personas": "http://people-service:80",
  "/api/inventarios": "http://inventory-service:80",
  "/api/ventas": "http://sale-service:80",
  "/api/finanzas": "http://payment-service:80",
};

export const configServices =
  SERVER_REDIRECTION === "DEV" ? devServices : prodServices;
