import { AuditLog, AuditLogCreationAttributes } from '../../models/audit-log.model';
import { parsePagination, buildMeta } from '../../utils/pagination';



export class AuditLogRepository {
  static async create(entry: AuditLogCreationAttributes): Promise<void> {
    // Fire and forget — audit failure must NEVER crash the main operation
    try {
      await AuditLog.create(entry );
    } catch (err) {
      console.error('[AuditLog] Failed to write audit entry:', err);
    }
  }

  static async findByEntity(
    entityType: string,
    entityId: string,
    query: Record<string, string>
  ) {
    const { page, limit, offset } = parsePagination(query);

    const { count, rows } = await AuditLog.findAndCountAll({
      where: { entity_type: entityType, entity_id: entityId },
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return { rows, meta: buildMeta(count, { page, limit, offset }) };
  }

  static async findByUser(
    userId: string,
    query: Record<string, string>
  ) {
    const { page, limit, offset } = parsePagination(query);

    const { count, rows } = await AuditLog.findAndCountAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return { rows, meta: buildMeta(count, { page, limit, offset }) };
  }
}