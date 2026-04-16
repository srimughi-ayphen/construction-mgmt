import { Model, Sequelize, DataTypes, Optional } from "sequelize";

export interface AssignmentAttributes {
  id: string;
  task_id: string;
  user_id: string;
  assigned_at: Date;
  assigned_by: string;
  updated_at?: Date;
}
type AssignmentCreationAttributes = Optional<
  AssignmentAttributes,
  "id" | "updated_at"
>;
export class Assignment
  extends Model<AssignmentAttributes, AssignmentCreationAttributes>
  implements AssignmentAttributes
{
  public id!: string;
  public task_id!: string;
  public user_id!: string;
  public assigned_at!: Date;
  public assigned_by!: string;
  public readonly updated_at!: Date;
}

export function initAssignmentModel(sequelize: Sequelize): void {
  Assignment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      task_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      assigned_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      assigned_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Assignment",
      tableName: "assignments",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
}
