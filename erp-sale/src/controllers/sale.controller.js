import { loggerError } from "@maur025/core-logger";
import { findAllSales } from "../services/sale.service.js";

export const getSales = async (req, res) => {
  try {
    const sales = await findAllSales();
    res.status(200).json(sales);
  } catch (error) {
    console.log(error);

    loggerError(`[SALES CONTROLLER] Error fetching sales: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
