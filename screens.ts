import { Task, TaskState } from './model';
import { TaskStorage } from './task-storage';
import { consolePrompt } from './util';

export function taskCompletionStatusToString(task: Task): string {
  if (task.state === TaskState.TODO) {
    return '_';
  }
  else if (task.state === TaskState.INPROGRESS) {
    return '~';
  }
  else if (task.state === TaskState.DONE) {
    return 'x';
  }
  else {
    throw new Error(`Neznamy stav ukolu: ${task.state}`);
  }
}

function formatBoolean(b: boolean) {
  return b === true ? 'Ano' : 'Ne';
}

function writeAllTasks(storage: TaskStorage) {
  const allTasks = storage.getAllTasks();

  if (allTasks.length === 0) {
    console.log('Nemate zadne ukoly.');
  } else {
    for (const task of allTasks) {
      console.log(
        `${task.id} ... [${taskCompletionStatusToString(task)}] ${task.name}`
      );
    }
  }
}

async function createTaskMenu(storage: TaskStorage) {
  console.clear();
  console.log('ZALOZIT NOVY UKOL');
  console.log('Nazev ukolu:');

  const taskName = await consolePrompt();

  storage.createTask(taskName);

  await mainMenu(storage);
}

async function manageTaskMenu(storage: TaskStorage, taskId: number) {
  const task = storage.getTaskById(taskId);

  console.clear();
  console.log('DETAIL UKOLU');
  console.log(`Nazev: ${task.name}`);
  console.log(`Stav: ${task.state}`);

  if (task.state === TaskState.TODO) {
    console.log('P ... Zacit pracovat na ukolu');
  }
  else if (task.state === TaskState.INPROGRESS) {
    console.log('H ... Oznacit ukol jako hotovy');
  }

  console.log('S ... Smazat ukol');
  console.log('Z ... Zavrit ukol');

  const action = await consolePrompt();

  if (action === 'p') {
    storage.setTaskCompletionStatus(taskId, TaskState.INPROGRESS);
    await manageTaskMenu(storage, taskId);
  } else if (action === 'h') {
    storage.setTaskCompletionStatus(taskId, TaskState.DONE);
    await manageTaskMenu(storage, taskId);
  } else if (action === 's') {
    storage.deleteTaskById(taskId);
    await mainMenu(storage);
  } else if (action === 'z') {
    await mainMenu(storage);
  } else {
    console.log('Neplatna volba.');
    await manageTaskMenu(storage, taskId);
  }
}

export async function mainMenu(storage: TaskStorage) {
  console.clear();
  console.log('UKOLNICEK');
  console.log('0 ... Zalozit novy ukol');
  console.log('---');
  writeAllTasks(storage);

  const selection = await consolePrompt();
  const selectedNumber = parseInt(selection, 10);

  if (!isNaN(selectedNumber)) {
    if (selectedNumber === 0) {
      await createTaskMenu(storage);
    } else {
      await manageTaskMenu(storage, selectedNumber);
    }
  } else {
    console.log('Neplatna volba.');
    await mainMenu(storage);
  }
}
