import { loggerError } from "@maur025/core-logger";
import { findAllSales, registerSale, findSaleById, annulSale } from "../services/sale.service.js";

export const getSales = async (req, res) => {
  try {
    const sales = await findAllSales();
    res.status(200).json(sales);
  } catch (error) {
    loggerError(`[SALES CONTROLLER] Error fetching sales: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createSale = async (req, res) => {
  try {
    const result = await registerSale(req.body);
    res.status(201).json({
      success: true,
      message: "Venta y factura registradas correctamente",
      data: result
    });
  } catch (error) {
    loggerError(`[SALES CONTROLLER] Error creating sale: ${error.message}`);
    res.status(400).json({ 
      success: false, 
      error: error.message || "Error al procesar la transacción" 
    });
  }
};

export const getSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await findSaleById(id);
    res.status(200).json(sale);
  } catch (error) {
    loggerError(`[SALES CONTROLLER] Error fetching sale ${req.params.id}: ${error.message}`);
    res.status(404).json({ error: error.message });
  }
};

export const updateSaleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Si el frontend envía el estado ANULADA, procesamos la anulación
    if (estado === 'ANULADA') {
      const result = await annulSale(id);
      return res.status(200).json({ success: true, message: "Venta anulada correctamente", data: result });
    }

    res.status(400).json({ error: "Solo se permite la actualización al estado ANULADA" });
  } catch (error) {
    loggerError(`[SALES CONTROLLER] Error updating sale ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};