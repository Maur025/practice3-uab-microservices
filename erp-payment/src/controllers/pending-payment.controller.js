import { loggerError } from "@maur025/core-logger";
import { findAllPendingPayments } from "../services/pending-payment.service.js";

export const getPendingPayments = async (req, res) => {
  try {
    const pendingPayments = await findAllPendingPayments();
    res.status(200).json(pendingPayments);
  } catch (error) {
    console.log(error);

    loggerError(
      `[PENDING PAYMENTS CONTROLLER] Error fetching pending payments: ${error.message}`,
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
