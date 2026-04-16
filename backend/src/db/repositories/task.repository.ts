import { User } from "../../models";
import { Milestone } from "../../models/milestone.model";
import { Task, TaskAttributes } from "../../models/task.model";
import { NotFoundError } from "../../utils/AppError";
import { buildMeta, parsePagination } from "../../utils/pagination";

const ASSIGNEE_INCLUDE = {
  association: "assignments",
  include: [
    {
      model: User,
      as: "assignee",
      attributes: ["id", "name", "email", "role"],
    },
  ],
};

export class TaskRepository {
  static async findByProject(
    projectId: string,
    filters: {
      page?: number;
      offset: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
      status?: string;
      priority?: string;
      due_date?: string;
      milestone_id?: string;
    },
  ) {
    const {
      status,
      offset,
      page = 1,
      limit = 20,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = filters;
    const where: Record<string, unknown> = { project_id: projectId };
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.due_date) where.due_date = filters.due_date;
    if (filters.milestone_id) where.milestone_id = filters.milestone_id;
    const { count, rows } = await Task.findAndCountAll({
      where,
      include: [
        {
          model: Milestone,
          as: "milestone",
          attributes: ["id", "name", "due_date"],
        },
        ASSIGNEE_INCLUDE,
      ],
      limit,
      order: [[filters.sortBy || "created_at", filters.sortOrder || "DESC"]],
      offset,
      distinct: true,
    });
    return { rows, meta: buildMeta(count, { page, limit, offset }) };
  }
  static async findByTaskId(id: string) {
    const task = await Task.findByPk(id, {
      include: [
        {
          model: Milestone,
          as: "milestone",
          attributes: ["id", "name", "due_date"],
        },
        ASSIGNEE_INCLUDE,
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });
    if (!task) throw new NotFoundError("Task");
    return task;
  }
  static async create(data: {
    project_id: string;
    milestone_id: string;
    title: string;
    description: string;
    status: "todo" | "in_progress" | "in_review" | "blocked" | "done";
    priority: "low" | "medium" | "high" | "critical";
    due_date: string;
    created_by: string;
  }) {
    return await Task.create(data as TaskAttributes);
  }
  static async update(
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
    const task = await TaskRepository.findByTaskId(id);
    return task.update(data);
  }
  static async softDelete(id: string) {
    const task = await TaskRepository.findByTaskId(id);
    await task.destroy();
  }
}
