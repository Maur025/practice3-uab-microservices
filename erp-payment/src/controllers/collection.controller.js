import { loggerError } from "@maur025/core-logger";
import { findAllCollections } from "../services/collection.service.js";

export const getCollections = async (req, res) => {
  try {
    const collections = await findAllCollections();
    res.status(200).json(collections);
  } catch (error) {
    console.log(error);

    loggerError(
      `[COLLECTIONS CONTROLLER] Error fetching collections: ${error.message}`,
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
