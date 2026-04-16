import { Request, Response, NextFunction } from 'express';
import { AuditLogService } from '../services/audit-log.service';
import { ApiResponse } from '../utils/apiResponse';

export class AuditLogController {
  static async getByEntity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { entityType, entityId } = req.params;
      const result = await AuditLogService.findByEntity(
        entityType as string,
        entityId as string,
        req.query as Record<string, string>
      );
      ApiResponse.paginated(res, result.rows, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await AuditLogService.findByUser(
        req.params.userId as string,
        req.query as Record<string, string>
      );
      ApiResponse.paginated(res, result.rows, result.meta);
    } catch (error) {
      next(error);
    }
  }
}