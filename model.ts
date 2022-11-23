export enum TaskState {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

interface AbstractTask {
  id: number;
  name: string;
  state: TaskState;
}

export interface TaskWithText extends AbstractTask {
  text: string;
}

export interface TaskWithList extends AbstractTask {
  list: string[];
}

export type Task = TaskWithText | TaskWithList;

export function isTaskWithText(t: Task): t is TaskWithText {
  return t.hasOwnProperty('text');
}

export function isTaskWithList(t: Task): t is TaskWithList {
  return t.hasOwnProperty('list');
}
