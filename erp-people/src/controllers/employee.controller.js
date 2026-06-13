import { loggerError } from "@maur025/core-logger";
import { findAllEmployees } from "../services/employee.service.js";

export const getEmployees = async (req, res) => {
  try {
    const employees = await findAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    console.log(error);

    loggerError(
      `[EMPLOYEE CONTROLLER] Error fetching employees: ${error.message}`,
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
