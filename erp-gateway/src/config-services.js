const { SERVER_REDIRECTION = "DEV" } = process.env;

// Use in localhost without containers case
// const devServices = {
//   "/api/organizaciones": "http://localhost:7806",
//   "/api/compras": "http://localhost:7801",
//   "/api/personas": "http://localhost:7802",
//   "/api/inventarios": "http://localhost:7803",
//   "/api/ventas": "http://localhost:7804",
//   "/api/finanzas": "http://localhost:7805",
// };

const devServices = {
  "/api/organizaciones": "http://uab-company:7806",
  "/api/compras": "http://uab-purchase:7801",
  "/api/personas": "http://uab-people:7802",
  "/api/inventarios": "http://uab-inventory:7803",
  "/api/ventas": "http://uab-sale:7804",
  "/api/finanzas": "http://uab-payment:7805",
};

const prodServices = {
  "/api/organizaciones": "http://company-service:80",
  "/api/compras": "http://purchase-service:80",
  "/api/personas": "http://people-service:80",
  "/api/inventarios": "http://inventory-service:80",
  "/api/ventas": "http://sale-service:80",
  "/api/finanzas": "http://payment-service:80",
};

export const configServices =
  SERVER_REDIRECTION === "DEV" ? devServices : prodServices;
