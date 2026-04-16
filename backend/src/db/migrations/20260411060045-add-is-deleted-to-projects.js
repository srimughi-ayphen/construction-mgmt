'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('projects', 'is_deleted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    await queryInterface.addIndex('projects', ['is_deleted'], {
      name: 'projects_is_deleted_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('projects', 'projects_is_deleted_idx');
    await queryInterface.removeColumn('projects', 'is_deleted');
  }
};