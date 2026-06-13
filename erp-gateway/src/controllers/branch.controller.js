import { loggerError } from "@maur025/core-logger";
import { findAllBranches } from "../services/branch.service.js";

export const getBranches = async (req, res) => {
  try {
    const branches = await findAllBranches();
    res.status(200).json(branches);
  } catch (error) {
    console.log(error);

    loggerError(
      `[BRANCHES CONTROLLER] Error fetching branches: ${error.message}`,
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
