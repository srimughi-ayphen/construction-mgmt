import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface MilestoneAttributes {
  id: string;
  name: string;
  due_date: string;
  project_id: string;
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
  is_completed: boolean;
}

type MilestoneCreationAttributes = Optional<
  MilestoneAttributes,
  "id" | "created_at" | "updated_at" | "is_completed" | "created_by"
>;
export class Milestone
  extends Model<MilestoneAttributes, MilestoneCreationAttributes>
  implements MilestoneAttributes
{
  public id!: string;
  public name!: string;
  public due_date!: string;
  public project_id!: string;
  public created_by?: string;
  public is_completed!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export function initMilestoneModel(sequelize: Sequelize): void {
  Milestone.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      // status: {
      //   type: DataTypes.ENUM("pending", "in_progress", "completed"),
      //   defaultValue: "pending",
      // },
      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      // is_deleted: {
      //   type: DataTypes.BOOLEAN,
      //   defaultValue: false,
      //   allowNull: false,
      // },
    },
    {
      sequelize,
      modelName: "Milestone",
      tableName: "milestones",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
}
