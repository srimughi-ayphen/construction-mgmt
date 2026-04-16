import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface TaskAttributes {
    id: string;
    title: string;
    description?: string;
    project_id: string;
    milestone_id?: string;
    status: "todo" | "in_progress" | "in_review" | "done" | "blocked";
    due_date?: string;
    priority: "low" | "medium" | "high" | "critical";
    created_by: string;
    created_at?: Date;
    updated_at?: Date;
    is_deleted?:boolean;
}

type TaskCreationAttributes = Optional<TaskAttributes, "id" | "created_at" | "updated_at">;

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: string;
    public title!: string;
    public description?: string;
    public project_id!: string;
    public milestone_id?: string;
    public status!: "todo" | "in_progress" | "in_review" | "done" | "blocked";
    public due_date?: string;
    public priority!: "low" | "medium" | "high" | "critical";
    public created_by!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public is_deleted!: boolean;
}

export function initTaskModel(sequelize: Sequelize): void {
    Task.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING(300),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            project_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            milestone_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("todo", "in_progress", "in_review", "done", "blocked"),
                defaultValue: "todo",
                allowNull: false,
            },
            due_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            priority: {
                type: DataTypes.ENUM("low", "medium", "high", "critical"),
                defaultValue: "medium",
                allowNull: false,
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            
        },
        {
            sequelize,
            modelName: "Task",
            tableName: "tasks",
            underscored: true,
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    );
}
    

