"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("projects", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: { type: Sequelize.STRING(200), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM("planning", "active", "on_hold", "completed"),
        allowNull: false,
        defaultValue: "planning",
      },
      start_date: { type: Sequelize.DATEONLY, allowNull: false },
      end_date: { type: Sequelize.DATEONLY, allowNull: true },
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

    await queryInterface.addIndex("projects", ["status"], {
      name: "projects_status_idx",
    });
    await queryInterface.addIndex("projects", ["created_by"], {
      name: "projects_created_by_idx",
    });
    await queryInterface.addIndex("projects", ["start_date"], {
      name: "projects_start_date_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("projects");
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_projects_status;",
    );
  },
};
