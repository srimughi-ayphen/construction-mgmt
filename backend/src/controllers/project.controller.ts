import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service';
import { ApiResponse } from '../utils/apiResponse';

export class ProjectController {

  static async getAllProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, meta } = await ProjectService.findAll(
        req.query as Record<string, string>
      );
      ApiResponse.paginated(res, data, meta);
    } catch (e) { next(e); }
  }

  static async getById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.findById(req.params.id);
      ApiResponse.success(res, project);
    } catch (e) { next(e); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.create(req.body);
      ApiResponse.created(res, project);
    } catch (e) {
      next(e);
    }
  }
  static async update(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.update(req.params.id, req.body);
      ApiResponse.success(res, project);
    } catch (e) { next(e); }
  }

  static async remove(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      await ProjectService.delete(req.params.id);
      ApiResponse.noContent(res);
    } catch (e) { next(e); }
  }

}