export enum TaskState {
  TODO = "TODO",
  INPROGRESS = "INPROGRESS",
  DONE = "DONE"
}

export interface TaskWithText {
  id: number;
  name: string;
  state: TaskState;
  text: string;
}

export interface TaskWithList {
  id: number;
  name: string;
  state: TaskState;
  list: string[];
}

export type Task = TaskWithText|TaskWithList;

export function isTaskWithText(task: Task): task is TaskWithText {
  return task.hasOwnProperty("text");
}

export function isTaskWithList(task: Task): task is TaskWithList {
  return task.hasOwnProperty("list");
}
