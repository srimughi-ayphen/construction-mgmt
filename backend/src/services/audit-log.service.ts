import { AuditLogRepository } from "../db/repositories/audit-log.repository";
import { AuditLogCreationAttributes } from "../models/audit-log.model";

export class AuditLogService {
  // Core method — all helpers funnel into this
  static async log(entry: AuditLogCreationAttributes): Promise<void> {
    await AuditLogRepository.create(entry);
  }

  static async logCreate(params: {
    userId: string | null;
    entityType: string;
    entityId: string;
    newValues: Record<string, unknown>;
    ipAddress?: string;
  }): Promise<void> {
    await AuditLogService.log({
      user_id: params.userId,
      action: "CREATE",
      entity_type: params.entityType,
      entity_id: params.entityId,
      new_values: params.newValues,
      ip_address: params.ipAddress,
    });
  }

  static async logUpdate(params: {
    userId: string | null;
    entityType: string;
    entityId: string;
    oldValues: Record<string, unknown>;
    newValues: Record<string, unknown>;
    ipAddress?: string;
  }): Promise<void> {
    await AuditLogService.log({
      user_id: params.userId,
      action: "UPDATE",
      entity_type: params.entityType,
      entity_id: params.entityId,
      old_values: params.oldValues,
      new_values: params.newValues,
      ip_address: params.ipAddress,
    });
  }

  static async logDelete(params: {
    userId: string | null;
    entityType: string;
    entityId: string;
    oldValues: Record<string, unknown>;
    ipAddress?: string;
  }): Promise<void> {
    await AuditLogService.log({
      user_id: params.userId,
      action: "DELETE",
      entity_type: params.entityType,
      entity_id: params.entityId,
      old_values: params.oldValues,
      ip_address: params.ipAddress,
    });
  }

  static async findByEntity(
    entityType: string,
    entityId: string,
    query: Record<string, string>,
  ) {
    return AuditLogRepository.findByEntity(entityType, entityId, query);
  }

  static async findByUser(userId: string, query: Record<string, string>) {
    return AuditLogRepository.findByUser(userId, query);
  }
}
