import { loggerError } from "@maur025/core-logger";
import { findAllProviders } from "../services/provider.service.js";

export const getProviders = async (req, res) => {
  try {
    const providers = await findAllProviders();
    res.status(200).json(providers);
  } catch (error) {
    console.log(error);

    loggerError(
      `[PROVIDER CONTROLLER] Error fetching providers: ${error.message}`,
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
