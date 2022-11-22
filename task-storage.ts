import { Task, TaskState, TaskWithList, TaskWithText } from './model';

export class TaskStorage {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  createTextTask(taskName: string, taskText: string) {
    const newTask: TaskWithText = {
      id: this.generateNewTaskId(),
      name: taskName,
      state: TaskState.TODO,
      text: taskText,
    };

    this.tasks.push(newTask);
  }

  createListTask(taskName: string, taskList: string[]) {
    const newTask: TaskWithList = {
      id: this.generateNewTaskId(),
      name: taskName,
      state: TaskState.TODO,
      list: taskList,
    };

    this.tasks.push(newTask);
  }

  getTaskById(taskId: number) {
    const task = this.tasks.find((t) => t.id === taskId);

    if (task !== undefined) {
      return task;
    } else {
      throw new Error(`Ukol s cislem ${taskId} nenalezen!`);
    }
  }

  deleteTaskById(taskId: number) {
    const taskIndex = this.tasks.indexOf(this.getTaskById(taskId));
    this.tasks.splice(taskIndex, 1);
  }

  setTaskCompletionStatus(taskId: number, newState: TaskState) {
    this.getTaskById(taskId).state = newState;
  }

  private generateNewTaskId(): number {
    const allTaskIds = this.tasks.map((t) => t.id);

    return Math.max(0, ...allTaskIds) + 1;
  }
}
