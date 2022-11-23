import { isTaskWithList, isTaskWithText, Task, TaskState } from './model';
import { TaskStorage } from './task-storage';
import { consolePrompt } from './util';

export function taskCompletionStatusToString(task: Task): string {
  if (task.state === TaskState.TODO) {
    return '_';
  } else if (task.state === TaskState.IN_PROGRESS) {
    return '~';
  } else if (task.state === TaskState.DONE) {
    return 'x';
  } else {
    throw new Error('Neznamy stav ukolu.');
  }
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
  console.log('T ... textovy ukol');
  console.log('S ... ukol se seznamem');

  const userInput = await consolePrompt();

  console.log('Nazev ukolu:');
  const taskName = await consolePrompt();

  if (userInput === 't') {
    console.log('Text ukolu:');
    const taskText = await consolePrompt();

    storage.createTextTask(taskName, taskText);
    await mainMenu(storage);
  } else if (userInput === 's') {
    const taskList: string[] = [];

    while (true) {
      console.log('Polozka seznamu (H pro dokonceni seznamu):');
      const listItem = await consolePrompt();

      if (listItem === 'h') {
        break;
      } else {
        taskList.push(listItem);
      }
    }

    storage.createListTask(taskName, taskList);
    await mainMenu(storage);
  } else {
    console.log('Neplatna volba.');
  }
}

async function manageTaskMenu(storage: TaskStorage, taskId: number) {
  const task = storage.getTaskById(taskId);

  console.clear();
  console.log('DETAIL UKOLU');
  console.log(`Nazev: ${task.name}`);
  console.log(`Stav: ${task.state}`);

  console.log('---');

  if (isTaskWithText(task)) {
    console.log(`Text: ${task.text}`);
  } else if (isTaskWithList(task)) {
    for (const listItem of task.list) {
      console.log(`* ${listItem}`);
    }
  }

  console.log('---');

  if (task.state === TaskState.TODO) {
    console.log('T ... Odstartovat ukol');
  } else if (task.state === TaskState.IN_PROGRESS) {
    console.log('H ... Oznacit ukol jako hotovy');
  }

  console.log('S ... Smazat ukol');
  console.log('Z ... Zavrit ukol');

  const action = await consolePrompt();

  if (action === 't') {
    storage.setTaskCompletionStatus(taskId, TaskState.IN_PROGRESS);
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
