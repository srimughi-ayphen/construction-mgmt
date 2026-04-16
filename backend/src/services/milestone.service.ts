import { MilestoneRepository } from "../db/repositories/milestone.repository";
import { ProjectRepository } from "../db/repositories/project.repository";
import { NotFoundError, ValidationError } from "../utils/AppError";

export class MilestoneService {
  static async findByMilestoneId(id: string) {
    const milestone = await MilestoneRepository.getMilestoneById(id);
    if (!milestone) throw new NotFoundError("Milestone");
    return milestone;
  }

  static async findByProjectId(projectId: string) {
    await ProjectRepository.getProjectById(projectId);
    return MilestoneRepository.getMilestonesByProjectId(projectId);
  }

  static async createMilestone(data: {
    project_id: string;
    name: string;
    due_date: string;
  }) {
    const project = await ProjectRepository.getProjectById(data.project_id);
    if (project.end_date && data.due_date > project.end_date) {
      throw new ValidationError(
        "Milestone due_date cannot be after the project end_date",
      );
    }
    if (data.due_date < project.start_date) {
      throw new ValidationError(
        "Milestone due_date cannot be before the project start_date",
      );
    }
    return await MilestoneRepository.createMilestone(data);
  }

  static async updateMilestone(
    id: string,
    data: Partial<{ name: string; due_date: string }>,
  ) {
    const milestone = await MilestoneRepository.getMilestoneById(id);
    if (!milestone) throw new NotFoundError("Milestone");
    return milestone.update(data);
  }

  static async completeMilestone(id: string) {
    const milestone = await MilestoneRepository.getMilestoneById(id);
    if (!milestone) throw new NotFoundError("Milestone");
    if (milestone.is_completed) {
      throw new ValidationError("Milestone is already completed");
    }
    return milestone.update({ is_completed: true });
  }

  static async delete(id: string) {
    return MilestoneRepository.delete(id);
  }
}
