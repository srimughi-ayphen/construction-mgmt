import { AssignmentRepository } from "../db/repositories/assignment.repository";
import { TaskRepository } from "../db/repositories/task.repository";
import { UserRepository } from "../db/repositories/user.repository";
import { User } from "../models";
import { ValidationError } from "../utils/AppError";
import { AuditLogService } from "./audit-log.service";

export class AssignmentService {
  static async findAssignmentByTask(taskId: string) {
    await TaskRepository.findByTaskId(taskId);
    return AssignmentRepository.findAssignmentByTask(taskId);
  }

  static async create(
    taskId: string,
    data: {
      user_id: string;
      assigned_by: string;
    },
  ) {
    const task = await TaskRepository.findByTaskId(taskId);

    // Rule 1: Cannot assign to a done task
    if (task.status === "done") {
      throw new ValidationError("Cannot assign workers to a completed task");
    }

    const user = await UserRepository.findById(data.user_id);

    // Rule 2: Only workers can be assigned
    if ((user as User).role !== "worker") {
      throw new ValidationError(
        "Only workers can be assigned to tasks. Use manager as created_by instead",
      );
    }

    // Rule 3: User must be active
    if (!(user as User).is_active) {
      throw new ValidationError("Cannot assign an inactive user to a task");
    }

    // Confirm assigner exists
    await UserRepository.findById(data.assigned_by);

    const assignment = await AssignmentRepository.createAssignment({ ...data, task_id: taskId });
    await AuditLogService.log({
      user_id: data.assigned_by || null,
      action: "ASSIGN",
      entity_type: "assignment",
      entity_id: taskId,
      new_values: { task_id: taskId, user_id: data.user_id },
    });
    return assignment;
  }

  static async deleteAssignment(taskId: string, userId: string) {
    await TaskRepository.findByTaskId(taskId);
    await AssignmentRepository.softDeleteAssignment(taskId, userId);
    await AuditLogService.log({
      user_id: null,
      action: "UNASSIGN",
      entity_type: "assignment",
      entity_id: taskId,
      old_values: { task_id: taskId, user_id: userId },
    });
  }
}
