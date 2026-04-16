import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import sequelize from "../config/database";

export interface ProjectAttributes {
  id: string;
  name: string;
  is_active: boolean;
  description?: string;
  start_date: string;
  end_date: string;
  status:"planning" | "active" | "on_hold" | "completed";
  is_deleted: boolean;
  created_by: string;
  created_at?: Date;
  updated_at?: Date;
}
type ProjectCreationAttributes = Optional<ProjectAttributes, "id" | "is_active" | "is_deleted" | "created_at" | "updated_at">;

export class Project
  extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes
{
  public id!: string;
  public name!: string;
  public is_active!: boolean;
  public description?: string;
  public start_date!: string;
  public end_date!: string;
  public status!: "planning" | "active" | "on_hold" | "completed";
  public is_deleted!: boolean;
  public created_by!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}
export function initProjectModel(sequelize: Sequelize): void {
  Project.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("planning", "active", "on_hold", "completed"),
        defaultValue: "planning",
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Project",
      tableName: "projects",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
}
