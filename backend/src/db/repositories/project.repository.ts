import { User } from "../../models";
import { Project } from "../../models/project.model";
import { NotFoundError } from "../../utils/AppError";
import { PaginationParams } from "../../utils/pagination";

const CREATOR_INCLUDE = {
  model: User,
  as: "creator",
  attributes: ["id", "name", "email", "role"],
};

export class ProjectRepository {
  static async getAllProjects(
    filters: {
      status?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
    } = {},
  ) {
    const {
      status,
      page = 1,
      limit = 20,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = filters;
    const where: Record<string, unknown> = { is_deleted: false };
    if (status) where.status = status;

    const { count, rows } = await Project.findAndCountAll({
      where,
      include: [CREATOR_INCLUDE],
      order: [[sortBy, sortOrder]],
      limit,
      offset: (page - 1) * limit,
    });

    return { rows, total: count, page, limit };
  }

  static async getProjectById(id: string) {
    const project = await Project.findOne({
      where: { id, is_deleted: false },
      include: [CREATOR_INCLUDE],
    });
    if (!project) throw new NotFoundError("Project");
    return project;
  }

  static async findByName(name: string) {
    return Project.findOne({ where: { name, is_deleted: false } });
  }

  static async create(data: {
    name: string;
    description?: string;
    status: "planning" | "active" | "on_hold" | "completed";
    start_date: string;
    end_date: string;
    created_by: string;
  }) {
    return Project.create(data);
  }

  static async updateProject(id: string, data: Partial<Project>) {
    const project = await ProjectRepository.getProjectById(id);
    return project.update(data);
  }

  static async softDelete(id: string) {
    const project = await Project.findByPk(id);
    if (!project) throw new NotFoundError("Project");
    await project.update({ is_deleted: true });
  }

  static async findByCreator(createdBy: string, pagination: PaginationParams) {
    const { count, rows } = await Project.findAndCountAll({
      where: { created_by: createdBy, is_deleted: false },
      include: [CREATOR_INCLUDE],
      order: [["created_at", "DESC"]],
      limit: pagination.limit,
      offset: pagination.offset,
    });
    return { rows, total: count };
  }

  static async findByAssignee(userId: string, pagination: PaginationParams) {
    const { count, rows } = await Project.findAndCountAll({
      where: { is_deleted: false },
      include: [
        CREATOR_INCLUDE,
        {
          association: "tasks",
          required: true,
          include: [
            {
              association: "assignments",
              required: true,
              where: { user_id: userId },
            },
          ],
        },
      ],
      distinct: true,
      limit: pagination.limit,
      offset: pagination.offset,
    });
    return { rows, total: count };
  }
}
