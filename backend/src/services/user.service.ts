import { UserRepository } from "../db/repositories/user.repository";
import { ConflictError, ValidationError } from "../utils/AppError";
import bcrypt from "bcryptjs";
import { parsePagination, buildMeta } from "../utils/pagination";
import { ProjectRepository } from "../db/repositories/project.repository";
import { AuditLogService } from "./audit-log.service";

export class UserService {
  static async getAllUsers(query: {
    role?: "admin" | "manager" | "worker";
    includeInactive?: string;
  }) {
    const is_active = query.includeInactive === "true" ? undefined : true;
    return UserRepository.findAll({ role: query.role, is_active });
  }

  static async findById(id: string) {
    return UserRepository.findById(id);
  }

  static async create(data: {
    name: string;
    email: string;
    password: string;
    role: "admin" | "manager" | "worker";
  }) {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) throw new ConflictError("Email already registered");

    if (data.password.length < 8)
      throw new ValidationError("Password must be at least 8 characters");

    const password_hash = await bcrypt.hash(data.password, 12);
    const { password, ...rest } = data;
    const user = await UserRepository.create({ ...rest, password_hash });
    await AuditLogService.logCreate({
      userId: null,
      entityType: "user",
      entityId: user.id,
      newValues: { name: data.name, email: data.email, role: data.role },
    });
    return user;
  }

  static async update(
    id: string,
    data: { name?: string; role?: "admin" | "manager" | "worker" },
  ) {
    await UserRepository.findById(id);
    return UserRepository.update(id, data);
  }

  static async delete(id: string, ) {
  const user = await UserRepository.findById(id);
    await AuditLogService.logDelete({
      userId: null,
      entityType: "user",
      entityId: id,
      oldValues: { name: user.name, email:user.email },
    });
    return UserRepository.softDelete(id);
  }

  static async getProjectsForUser(
    userId: string,
    query: Record<string, string>,
  ) {
    await UserRepository.findById(userId);
    const { page, limit, offset } = parsePagination(query);
    const { rows, total } = await ProjectRepository.findByAssignee(userId, {
      page,
      limit,
      offset,
    });
    return { data: rows, meta: buildMeta(total, { page, limit, offset }) };
  }
}
