import { User } from '../../models';
import { Assignment } from '../../models/assignment.model';
import { NotFoundError, ConflictError } from '../../utils/AppError';

export class AssignmentRepository {

  static async findAssignmentByTask(taskId: string) {
    return Assignment.findAll({
      where: { task_id: taskId },
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email', 'role'] },
        { model: User, as: 'assigner', attributes: ['id', 'name', 'email'] },
      ],
      order: [['assigned_at', 'ASC']],
    });
  }

  static async findAssignmentByTaskAndUser(taskId: string, userId: string) {
    return Assignment.findOne({ where: { task_id: taskId, user_id: userId } });
  }

  static async createAssignment(data: {
    task_id: string; user_id: string; assigned_by: string;
  }) {
    const existing = await AssignmentRepository.findAssignmentByTaskAndUser(data.task_id, data.user_id);
    if (existing) {
      throw new ConflictError('User is already assigned to this task');
    }
    return Assignment.create({ ...data, assigned_at: new Date() } as Assignment);
  }

  static async softDeleteAssignment(taskId: string, userId: string) {
    const assignment = await AssignmentRepository.findAssignmentByTaskAndUser(taskId, userId);
    if (!assignment) throw new NotFoundError('Assignment');
    await assignment.destroy();
  }

}