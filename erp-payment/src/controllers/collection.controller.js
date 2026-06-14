import { loggerError } from "@maur025/core-logger";
import { findAllCollections, registerCollection } from "../services/collection.service.js";

export const getCollections = async (req, res) => {
  try {
    const collections = await findAllCollections();
    res.status(200).json(collections);
  } catch (error) {
    loggerError(`[COLLECTIONS CONTROLLER] Error fetching collections: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Nuestro nuevo controlador para procesar el pago
export const createCollection = async (req, res) => {
  try {
    const result = await registerCollection(req.body);
    
    res.status(201).json({
      success: true,
      message: "Pago registrado exitosamente",
      data: result
    });
  } catch (error) {
    loggerError(`[COLLECTIONS CONTROLLER] Error creating collection: ${error.message}`);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};