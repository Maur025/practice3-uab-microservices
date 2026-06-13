import { loggerError } from "@maur025/core-logger";
import { findAllClients } from "../services/client.service.js";

export const getClients = async (req, res) => {
  try {
    const clients = await findAllClients();
    res.status(200).json(clients);
  } catch (error) {
    console.log(error);

    loggerError(
      `[CLIENTS CONTROLLER] Error fetching clients: ${error.message}`,
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
