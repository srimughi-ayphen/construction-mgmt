"use strict";

const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const adminId = uuidv4();
const managerId = uuidv4();
const workerId1 = uuidv4();
const workerId2 = uuidv4();
const projectId = uuidv4();
const milestoneId = uuidv4();

module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash("Password123!", 12);

    await queryInterface.bulkInsert("users", [
      {
        id: adminId,
        name: "Alice Admin",
        email: "alice@build.com",
        password_hash: hash,
        role: "admin",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: managerId,
        name: "Bob Manager",
        email: "bob@build.com",
        password_hash: hash,
        role: "manager",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: workerId1,
        name: "Carol Worker",
        email: "carol@build.com",
        password_hash: hash,
        role: "worker",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: workerId2,
        name: "David Worker",
        email: "david@build.com",
        password_hash: hash,
        role: "worker",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("projects", [
      {
        id: projectId,
        name: "Harbour Bridge Restoration",
        description: "Phase 1 structural restoration of the north pylon.",
        status: "active",
        start_date: "2026-01-15",
        end_date: "2026-09-30",
        created_by: managerId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("milestones", [
      {
        id: milestoneId,
        project_id: projectId,
        name: "Foundation Inspection Sign-off",
        due_date: "2026-03-31",
        is_completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    const taskId = uuidv4();

    await queryInterface.bulkInsert("tasks", [
      {
        id: taskId,
        project_id: projectId,
        milestone_id: milestoneId,
        title: "Conduct concrete core sampling",
        description:
          "Extract 12 core samples from north pylon base for lab analysis.",
        status: "in_progress",
        priority: "high",
        due_date: "2026-03-15",
        created_by: managerId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("assignments", [
      {
        id: uuidv4(),
        task_id: taskId,
        user_id: workerId1,
        assigned_by: managerId,
        assigned_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("assignments", null, {});
    await queryInterface.bulkDelete("tasks", null, {});
    await queryInterface.bulkDelete("milestones", null, {});
    await queryInterface.bulkDelete("projects", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};
