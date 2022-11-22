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
