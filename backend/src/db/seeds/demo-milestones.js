"use strict";
const managerId = uuidv4();
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("milestones", [
      {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        project_id: "336fc28d-b24a-4ecd-9017-39b0d8171c1b",
        name: "Foundation Complete",
        due_date: "2026-03-01",
        is_completed: false,
       created_by: managerId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("milestones", null, {});
  },
};