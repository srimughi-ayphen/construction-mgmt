"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("milestones", {
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
      name: { type: Sequelize.STRING(200), allowNull: false },
      due_date: { type: Sequelize.DATEONLY, allowNull: false },
      is_completed: { type: Sequelize.BOOLEAN, defaultValue: false },
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
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
    });

    await queryInterface.addIndex("milestones", ["project_id"], {
      name: "milestones_project_id_idx",
    });
    await queryInterface.addIndex("milestones", ["is_completed"], {
      name: "milestones_is_completed_idx",
    });
    await queryInterface.addIndex("milestones", ["due_date"], {
      name: "milestones_due_date_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("milestones");
  },
};
