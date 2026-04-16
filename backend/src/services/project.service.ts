import { ProjectRepository } from "../db/repositories/project.repository";
import { UserRepository } from "../db/repositories/user.repository";
import { Project } from "../models/project.model";
import { ConflictError, ValidationError } from "../utils/AppError";
import { parsePagination, buildMeta } from "../utils/pagination";

export class ProjectService {
static async findAll(query: { status?: string; page?: string; limit?: string; sortBy?: string; sortOrder?: string }) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));

    const ALLOWED_SORT_COLUMNS = ['created_at', 'start_date', 'end_date', 'name', 'status'];
    const ALLOWED_SORT_ORDERS = ['ASC', 'DESC'];

    const sortBy = ALLOWED_SORT_COLUMNS.includes(query.sortBy || '')
      ? query.sortBy!
      : 'created_at';

    const sortOrder = ALLOWED_SORT_ORDERS.includes((query.sortOrder || '').toUpperCase())
      ? query.sortOrder!.toUpperCase()
      : 'DESC';

    const { rows, total } = await ProjectRepository.getAllProjects({
      status: query.status,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return {
      data: rows,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  static async findById(id: string) {
    return ProjectRepository.getProjectById(id);
  }

  static async create(data: {
    name: string;
    description?: string;
    status?: "planning" | "active" | "on_hold" | "completed";
    start_date: string;
    end_date: string;
    created_by: string;
  }) {
    // Business rule: project name must be unique
    const existing = await ProjectRepository.findByName(data.name);
    if (existing)
      throw new ConflictError(`Project '${data.name}' already exists`);

    // Business rule: created_by must be a valid user
    await UserRepository.findById(data.created_by);

    // Business rule: end_date must be after start_date
    if (data.end_date && data.end_date <= data.start_date)
      throw new ValidationError("end_date must be after start_date");

    return ProjectRepository.create({
      ...data,
      status: data.status || "planning",
    });
  }

  static async update(id: string, data: Partial<Project>) {
    const project = await ProjectRepository.getProjectById(id);

    // If name changes, check uniqueness
    if (data.name && data.name !== project.name) {
      const clash = await ProjectRepository.findByName(data.name);
      if (clash)
        throw new ConflictError(`Project '${data.name}' already exists`);
    }

    // Validate dates against current values if partially updated
    const start = data.start_date || project.start_date;
    const end = data.end_date || project.end_date;
    if (end && end <= start)
      throw new ValidationError("end_date must be after start_date");

    return ProjectRepository.updateProject(id, data);
  }

  static async delete(id: string) {
    await ProjectRepository.getProjectById(id);
    return ProjectRepository.softDelete(id);
  }
}
