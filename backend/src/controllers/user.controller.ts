import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { ApiResponse } from "../utils/apiResponse";

export class UserController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers(
        req.query as Record<string, string>,
      );
      ApiResponse.success(res, users);
    } catch (e) {
      next(e);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.findById(req.params.id as string);
      ApiResponse.success(res, user);
    } catch (e) {
      next(e);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.create(req.body);
      ApiResponse.created(res, user);
    } catch (e) {
      next(e);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.update(req.params.id as string, req.body);
      ApiResponse.success(res, user);
    } catch (e) {
      next(e);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.delete(req.params.id as string);
      ApiResponse.noContent(res);
    } catch (e) {
      next(e);
    }
  }

  // static async getProjects(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const result = await UserService.getProjectsForUser(
  //       req.params.id,
  //       req.query as Record<string, string>
  //     );
  //     ApiResponse.paginated(res, result.data, result.meta);
  //   } catch (e) { next(e); }
  // }
}
