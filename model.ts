export enum TaskState {
  TODO = "TODO",
  INPROGRESS = "INPROGRESS",
  DONE = "DONE"
}

export interface Task {
  id: number;
  name: string;
  state: TaskState;
}
