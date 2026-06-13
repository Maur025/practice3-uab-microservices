import { loggerError } from "@maur025/core-logger";
import { findAllPendingCollections } from "../services/pending-collection.service.js";

export const getPendingCollections = async (req, res) => {
  try {
    const pendingCollections = await findAllPendingCollections();
    res.status(200).json(pendingCollections);
  } catch (error) {
    console.log(error);

    loggerError(
      `[PENDING COLLECTIONS CONTROLLER] Error fetching pending collections: ${error.message}`,
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
