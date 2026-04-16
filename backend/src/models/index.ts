import sequelize from "../config/database";
import { initUserModel } from "./user.model";
import { initProjectModel } from "./project.model";
import { defineAssociations } from "./associations";
import { initMilestoneModel } from "./milestone.model";
import { initTaskModel } from "./task.model";
import { initAssignmentModel } from "./assignment.model";
import { initAuditLogModel } from "./audit-log.model";

export function initModels(): void {
  initUserModel(sequelize);
  initProjectModel(sequelize);
  initMilestoneModel(sequelize);
  initTaskModel(sequelize);
  initAssignmentModel(sequelize);
  initAuditLogModel(sequelize);
  defineAssociations();
}

// Re-export models so the rest of the app imports from one place
export { default as User } from "./user.model";

