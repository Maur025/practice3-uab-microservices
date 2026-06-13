import { loggerError } from "@maur025/core-logger";
import { findAllPayments } from "../services/payment.service.js";

export const getPayments = async (req, res) => {
  try {
    const payments = await findAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    console.log(error);

    loggerError(
      `[PAYMENTS CONTROLLER] Error fetching payments: ${error.message}`,
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
