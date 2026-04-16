"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tasks", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "projects", key: "id" },
        onDelete: "CASCADE",
      },
      milestone_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "milestones", key: "id" },
        onDelete: "SET NULL",
      },
      title: { type: Sequelize.STRING(300), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM(
          "todo",
          "in_progress",
          "in_review",
          "done",
          "blocked",
        ),
        allowNull: false,
        defaultValue: "todo",
      },
      priority: {
        type: Sequelize.ENUM("low", "medium", "high", "critical"),
        allowNull: false,
        defaultValue: "medium",
      },
      due_date: { type: Sequelize.DATEONLY, allowNull: true },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "RESTRICT",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("tasks", ["project_id"], {
      name: "tasks_project_id_idx",
    });
    await queryInterface.addIndex("tasks", ["milestone_id"], {
      name: "tasks_milestone_id_idx",
    });
    await queryInterface.addIndex("tasks", ["status"], {
      name: "tasks_status_idx",
    });
    await queryInterface.addIndex("tasks", ["priority"], {
      name: "tasks_priority_idx",
    });
    await queryInterface.addIndex("tasks", ["created_by"], {
      name: "tasks_created_by_idx",
    });
    await queryInterface.addIndex("tasks", ["due_date"], {
      name: "tasks_due_date_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("tasks");
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_tasks_status;",
    );
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_tasks_priority;",
    );
  },
};
