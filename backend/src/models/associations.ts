import { Milestone } from "./milestone.model";
import { Project } from "./project.model";
import User from "./user.model";
import { Task } from "./task.model";
import { Assignment } from "./assignment.model";
import { AuditLog } from "./audit-log.model";

export function defineAssociations(): void {
  User.hasMany(Project, { foreignKey: "created_by", as: "createdProjects" });
  User.hasMany(Task, { foreignKey: "created_by", as: "createdTasks" });
  User.hasMany(Assignment, { foreignKey: "user_id", as: "assignments" });
  User.hasMany(AuditLog, { foreignKey: "user_id", as: "auditLogs" });
  Project.belongsTo(User, { foreignKey: "created_by", as: "creator" });
  Project.hasMany(Milestone, {
    foreignKey: "project_id",
    as: "milestones",
    onDelete: "CASCADE",
  });
  Project.hasMany(Task, {
    foreignKey: "project_id",
    as: "tasks",
    onDelete: "CASCADE",
  });
  Milestone.belongsTo(User, {
    foreignKey: "created_by",
    as: "creator",
  });
  Milestone.belongsTo(Project, { foreignKey: "project_id", as: "project" });
  Milestone.hasMany(Task, { foreignKey: "milestone_id", as: "tasks" });
  Task.belongsTo(Project, { foreignKey: "project_id", as: "project" });
  Task.belongsTo(Milestone, { foreignKey: "milestone_id", as: "milestone" });
  Task.belongsTo(User, { foreignKey: "created_by", as: "creator" });
  Task.hasMany(Assignment, {
    foreignKey: "task_id",
    as: "assignments",
    onDelete: "CASCADE",
  });
  Assignment.belongsTo(Task, { foreignKey: "task_id", as: "task" });
  Assignment.belongsTo(User, { foreignKey: "user_id", as: "assignee" });
  Assignment.belongsTo(User, { foreignKey: "assigned_by", as: "assigner" });
  AuditLog.belongsTo(User, { foreignKey: "user_id", as: "user" });
}
