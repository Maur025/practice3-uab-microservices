import { loggerError } from "@maur025/core-logger";
import { findAllPendingCollections, registerPendingCollection } from "../services/pending-collection.service.js";

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

// Nuestro nuevo controlador para procesar la creación
export const createPendingCollection = async (req, res) => {
  try {
    const result = await registerPendingCollection(req.body);

    res.status(201).json({
      success: true,
      message: "Cuenta por cobrar registrada exitosamente",
      data: result
    });
  } catch (error) {
    loggerError(`[PENDING COLLECTIONS CONTROLLER] Error creating pending collection: ${error.message}`);
    res.status(400).json({ 
      success: false, 
      error: error.message || "Error al registrar la cuenta por cobrar" 
    });
  }
};