import { loggerError } from "@maur025/core-logger";
import { findAllPurchases } from "../services/purchase.service.js";

export const getPurchases = async (req, res) => {
  try {
    const purchases = await findAllPurchases();
    res.status(200).json(purchases);
  } catch (error) {
    console.log(error);

    loggerError(
      `[PURCHASES CONTROLLER] Error fetching purchases: ${error.message}`,
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
