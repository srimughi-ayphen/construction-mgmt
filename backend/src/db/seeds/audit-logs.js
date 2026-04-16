"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("audit_logs", [
      {
        id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
        user_id: "423c2fb7-659f-4a57-96d3-0701637fa614",
        action: "CREATE",
        entity_type: "TASK",
        entity_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        old_values: null,
        new_values: JSON.stringify({ title: "Lay Foundation" }),
        ip_address: "127.0.0.1",
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("audit_logs", null, {});
  },
};