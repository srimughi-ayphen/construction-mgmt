import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";
import { ApiResponse } from "../utils/apiResponse";

export class TaskController {
    static async getTasksByProjectId(req: Request, res: Response, next: NextFunction) {
        try {
            const tasks = await TaskService.findByProjectId(req.params.projectId as string, req.query);
            ApiResponse.paginated(res, tasks.data, tasks.meta);
        } catch (error) {
            next(error);
        }
    }
    static async getTaskById(req: Request, res: Response, next: NextFunction) {
        try {
            const task = await TaskService.findByTaskId(req.params.id as string);
            ApiResponse.success(res, task);
        } catch (error) {
            next(error);
        }
    }
    static async createTask(req: Request, res: Response, next: NextFunction) {
        try {
            const task = await TaskService.createTask({
                project_id: req.params.projectId,
                ...req.body,
            });
            ApiResponse.created(res, task);
        } catch (error) {
            next(error);
        }
    }
    static async updateTask(req: Request, res: Response, next: NextFunction) {
        try {
            const task = await TaskService.updateTask(req.params.id as string, req.body);
            ApiResponse.success(res, task);
        } catch (error) {
            next(error);
        }
    }
    static async deleteTask(req: Request, res: Response, next: NextFunction) {
        try {
            await TaskService.deleteTask(req.params.id as string);
            ApiResponse.noContent(res);
        } catch (error) {
            next(error);
        }
    }
    static async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const task = await TaskService.updateStatus(req.params.id as string, req.body.status);
            ApiResponse.success(res, task);
        } catch (error) {
            next(error);
        }
    }
}
