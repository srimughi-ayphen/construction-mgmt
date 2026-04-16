"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("assignments", [
      {
        id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        task_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        user_id: "11111111-1111-1111-1111-111111111111",
        assigned_by: "423c2fb7-659f-4a57-96d3-0701637fa614",
        assigned_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("assignments", null, {});
  },
};