import { MilestoneRepository } from "../db/repositories/milestone.repository";
import { ProjectRepository } from "../db/repositories/project.repository";
import { TaskRepository } from "../db/repositories/task.repository";
import { ValidationError } from "../utils/AppError";
import { AuditLogService } from "./audit-log.service";

const STATUS_TRANSITIONS: Record<string, string[]> = {
  todo: ["in_progress"],
  in_progress: ["in_review", "blocked", "todo"],
  in_review: ["done", "in_progress"],
  blocked: ["in_progress", "todo"],
  done: [],
};
export class TaskService {
  static async findByProjectId(
    projectId: string,
    query: {
      status?: string;
      page?: string;
      limit?: string;
      sortBy?: string;
      sortOrder?: string;
    },
  ) {
    const page = Math.max(1, parseInt(query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || "20", 10)));

    const ALLOWED_SORT_COLUMNS = [
      "created_at",
      "start_date",
      "end_date",
      "name",
      "status",
    ];
    const ALLOWED_SORT_ORDERS = ["ASC", "DESC"];

    const sortBy = ALLOWED_SORT_COLUMNS.includes(query.sortBy || "")
      ? query.sortBy!
      : "created_at";

    const sortOrder = ALLOWED_SORT_ORDERS.includes(
      (query.sortOrder || "").toUpperCase(),
    )
      ? query.sortOrder!.toUpperCase()
      : "DESC";
    await ProjectRepository.getProjectById(projectId);
    const offset = (page - 1) * limit;
    const { rows, meta } = await TaskRepository.findByProject(projectId, {
      page,
      limit,
      sortBy,
      sortOrder,
      offset,
    });
    return {
      data: rows,
      meta: {
        total: meta.total,
        page,
        limit,
        totalPages: Math.ceil(meta.total / limit),
        hasNext: page < Math.ceil(meta.total / limit),
        hasPrev: page > 1,
      },
    };
  }

  static async findByTaskId(id: string) {
    return await TaskRepository.findByTaskId(id);
  }
  static async createTask(data: {
    project_id: string;
    milestone_id: string;
    title: string;
    description: string;
    status: "todo" | "in_progress" | "in_review" | "blocked" | "done";
    priority: "low" | "medium" | "high" | "critical";
    due_date: string;
    created_by: string;
  }) {
    const project = await ProjectRepository.getProjectById(data.project_id);

    if (project.status === "completed") {
      throw new ValidationError("Cannot add tasks to a completed project");
    }
    if (data.due_date && project.end_date && data.due_date > project.end_date) {
      throw new ValidationError("Task due_date cannot be after the project end_date");
    }
    if (data.milestone_id) {
      const milestone = await MilestoneRepository.getMilestoneById(
        data.milestone_id,
      );
      if (milestone?.project_id !== data.project_id) {
        throw new ValidationError("Milestone does not belong to this project");
      }
    }
    const task = await TaskRepository.create(data);
    await AuditLogService.log({
      user_id: data.created_by || null,
      action: "CREATE",
      entity_type: "task",
      entity_id: task.id,
      new_values: { title: task.title, project_id: task.project_id },
    });
    return task;
  }
  static async updateTask(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      status: "todo" | "in_progress" | "in_review" | "blocked" | "done";
      priority: "low" | "medium" | "high" | "critical";
      due_date: string;
      milestone_id: string;
    }>,
  ) {
    return await TaskRepository.update(id, data);
  }
  static async deleteTask(id: string) {
    await TaskRepository.findByTaskId(id);
    return await TaskRepository.softDelete(id);
  }
  static async updateStatus(
    id: string,
    newStatus: "todo" | "in_progress" | "in_review" | "blocked" | "done",
  ) {
    const task = await TaskRepository.findByTaskId(id);
    const currentStatus = task.status;
    const allowed = STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowed.includes(newStatus)) {
      throw new ValidationError(
        `Cannot transition from '${currentStatus}' to '${newStatus}'. ` +
          `Allowed: ${allowed.length ? allowed.join(", ") : "none (terminal state)"}`,
      );
    }

    const updatedTask = await TaskRepository.update(id, { status: newStatus });
    await AuditLogService.log({
      user_id: null,
      action: "STATUS_CHANGE",
      entity_type: "task",
      entity_id: id,
      old_values: { status: currentStatus },
      new_values: { status: newStatus },
    });
    return updatedTask;
  }
}
