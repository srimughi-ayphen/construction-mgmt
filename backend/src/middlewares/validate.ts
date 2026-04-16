import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type Target = "body" | "params" | "query";

export const validate =
  (schema: ZodSchema, target: Target = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      res.status(400).json({ success: false, error: result.error.issues });
      return;
    }
    if (target === "body") {
      req.body = result.data;
    } else {
      Object.assign(req[target], result.data);
    }
    next();
  };
