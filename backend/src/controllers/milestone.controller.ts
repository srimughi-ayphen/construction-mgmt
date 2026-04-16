import { NextFunction, Request, Response } from "express";
import { MilestoneService } from "../services/milestone.service";
import { ApiResponse } from "../utils/apiResponse";

export class MilestoneController {
  static async getMilestoneById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const milestone = await MilestoneService.findByMilestoneId(req.params.id);
      ApiResponse.success(res, milestone);
    } catch (error) {
      next(error);
    }
  }

  static async getMilestonesByProjectId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const milestones = await MilestoneService.findByProjectId(req.params.projectId as string);
      ApiResponse.success(res, milestones);
    } catch (error) {
      next(error);
    }
  }

  static async createMilestone(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const milestone = await MilestoneService.createMilestone({
        project_id: req.params.projectId,
        ...req.body,
      });
      ApiResponse.created(res, milestone);
    } catch (error) {
      next(error);
    }
  }

  static async updateMilestone(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const milestone = await MilestoneService.updateMilestone(
        req.params.id,
        req.body,
      );
      ApiResponse.success(res, milestone);
    } catch (error) {
      next(error);
    }
  }

  static async completeMilestone(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const milestone = await MilestoneService.completeMilestone(req.params.id);
      ApiResponse.success(res, milestone);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMilestone(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await MilestoneService.delete(req.params.id);
      ApiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}
