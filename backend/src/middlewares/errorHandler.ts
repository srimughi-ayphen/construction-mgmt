import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error("=== ERROR CAUGHT ===");
  console.error("Name:", error.name);
  console.error("Message:", error.message);
  console.error("Stack:", error.stack);
  console.error("====================");
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ success: false, error: error.message });
    return;
  }
  console.error("UNHANDLED ERROR:", error);
  res
    .status(500)
    .json({ success: false, error: "An unexpected error occurred." });
}
