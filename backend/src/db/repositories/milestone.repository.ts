import { Milestone } from "../../models/milestone.model";
import { NotFoundError } from "../../utils/AppError";

export class MilestoneRepository {
  static async createMilestone(data: {
    project_id: string;
    name: string;
    due_date: string;
    created_by?: string;
  }) {
    return await Milestone.create(data);
  }
  static async getAllMilestones(
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
    const where: Record<string, unknown> = {
      // is_deleted: false
    };
    // if (status) where.status = status;

    const { count, rows } = await Milestone.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit,
      offset: (page - 1) * limit,
    });

    return { rows, total: count, page, limit };
  }

  static async getMilestonesByProjectId(projectId: string) {
    return await Milestone.findAll({
      where: {
        project_id: projectId,
        // is_deleted: false
      },
    });
  }
  static async getMilestoneById(id: string): Promise<Milestone | null> {
    return await Milestone.findByPk(id);
  }

  static async updateMilestone(
    id: string,
    data: Partial<{ name: string; due_date: string }>,
  ) {
    const milestone = await MilestoneRepository.getMilestoneById(id);
    if (!milestone) {
      throw new NotFoundError("Milestone");
    }
    return milestone.update(data);
  }

  static async delete(id: string) {
    const milestone = await Milestone.findByPk(id);
    if (!milestone) throw new NotFoundError("Milestone");
    await milestone.destroy();
  }
}
