import { Op } from "sequelize";
import { NotFoundError } from "../../utils/AppError";
import { User } from "../../models";

const SAFE_ATTRIBUTES = [
  "id",
  "name",
  "email",
  "role",
  "is_active",
  "created_at",
  "updated_at",
];

export class UserRepository {
  static async findAll(filters: { role?: string; is_active?: boolean } = {}) {
    const where: Record<string, unknown> = {};
    if (filters.role) where.role = filters.role;
    if (filters.is_active !== undefined) where.is_active = filters.is_active;
    return User.findAll({
      where,
      attributes: SAFE_ATTRIBUTES,
      order: [["created_at", "DESC"]],
    });
  }

  static async findById(id: string) {
    const user = await User.findByPk(id, { attributes: SAFE_ATTRIBUTES });
    if (!user) throw new NotFoundError("User");
    return user;
  }

  static async findByEmail(email: string) {
    // Intentionally includes password_hash - used only for auth
    return User.findOne({ where: { email } });
  }

  static async count(filters: { role?: string } = {}) {
    const where: Record<string, unknown> = {};
    if (filters.role) where.role = filters.role;
    return User.count({ where });
  }

  static async create(data: {
    name: string;
    email: string;
    password_hash: string;
    role: string;
  }) {
    const user = await User.create(data as any);
    const { password_hash, ...safe } = user.toJSON();
    return safe;
  }

  static async update(
    id: string,
    data: Partial<{ name: string; role: "admin" | "manager" | "worker" }>,
  ) {
    const user = await UserRepository.findById(id);
    await user.update(data);
    return user.reload({ attributes: SAFE_ATTRIBUTES });
  }

  static async softDelete(id: string) {
    const user = await User.findByPk(id);
    if (!user) throw new NotFoundError("User");
    await user.update({ is_active: false });
  }
}
