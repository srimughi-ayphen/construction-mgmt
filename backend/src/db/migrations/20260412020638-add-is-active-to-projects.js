'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('projects', 'is_active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });

    await queryInterface.addIndex('projects', ['is_active'], {
      name: 'projects_is_active_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('projects', 'projects_is_active_idx');
    await queryInterface.removeColumn('projects', 'is_active');
  }
};