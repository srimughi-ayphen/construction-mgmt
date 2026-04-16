import { Request, Response, NextFunction } from "express";
import { AssignmentService } from "../services/assignment.service";
import { ApiResponse } from "../utils/apiResponse";

export class AssignmentController {
    static async getAssignmentByTask(req: Request, res: Response, next: NextFunction) {
        try {
            const assignment = await AssignmentService.findAssignmentByTask(req.params.taskId as string);
            ApiResponse.success(res, assignment);
        } catch (error) {
            next(error);
        }
    }
    static async createAssignment(req: Request, res: Response, next: NextFunction) {
        try {
            const assignment = await AssignmentService.create(req.params.taskId as string, req.body);
            ApiResponse.created(res, assignment);
        } catch (error) {
            next(error);
        }
    }

    static async deleteAssignment(req: Request, res: Response, next: NextFunction) {
        try {
            await AssignmentService.deleteAssignment(req.params.taskId as string, req.params.userId as string);
            ApiResponse.noContent(res);
        } catch (error) {
            next(error);
        }
    }
}
