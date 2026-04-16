"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("tasks", [
      {
        id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        project_id: "336fc28d-b24a-4ecd-9017-39b0d8171c1b",
        milestone_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        title: "Lay Foundation",
        description: "Initial groundwork",
        status: "todo",
        priority: "high",
        due_date: "2026-02-15",
        created_by: "423c2fb7-659f-4a57-96d3-0701637fa614",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("tasks", null, {});
  },
};