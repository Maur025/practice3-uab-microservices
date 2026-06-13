import { loggerError } from "@maur025/core-logger";
import { findAllProducts } from "../services/product.service.js";

export const getProducts = async (req, res) => {
  try {
    const products = await findAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);

    loggerError(
      `[PRODUCTS CONTROLLER] Error fetching products: ${error.message}`,
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
