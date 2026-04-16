import { Optional, Model, Sequelize, DataTypes } from "sequelize";

export interface AuditLogAttributes {
  id: string;
  user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  created_at?: Date;
}
export type AuditLogCreationAttributes = Optional<
  AuditLogAttributes,
  "id" | "created_at" | "old_values" | "new_values" | "ip_address" | "user_id"
>;
export class AuditLog
  extends Model<AuditLogAttributes, AuditLogCreationAttributes>
  implements AuditLogAttributes
{
  public id!: string;
  public user_id?: string | null;
  public action!: string;
  public entity_type!: string;
  public entity_id!: string;
  public old_values!: Record<string, unknown>;
  public new_values!: Record<string, unknown>;
   public ip_address!: string;
  public created_at!: Date;
}
export function initAuditLogModel(sequelize: Sequelize): void {
  AuditLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entity_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entity_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      old_values: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      new_values: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ip_address:{
        type: DataTypes.STRING(45),
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: "AuditLog",
      tableName: "audit_logs",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    },
  );
}
