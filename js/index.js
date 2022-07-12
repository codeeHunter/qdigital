const taskName = document.getElementById("taskName");
const addTask = document.getElementById("addTask");
const taskList = document.querySelector(".taskList");
const newTask = document.querySelector(".subTask");
const subTask = document.getElementById("addSubTask");
const time = document.getElementById("time");
const taskDecription = document.querySelectorAll(".description input");
const saveLocal = document.getElementById("saveLocal");

let subTasks = [];
let tasks = [];

function setId() {
  return Math.floor(Math.random() * 9999999999);
}

let magicIndex = setId();

function SubTask(id, description, time) {
  this.id = id;
  this.description = description;
  this.time = time;
}

function Task(id, name) {
  this.id = id;
  this.name = name;
  this.subTasks = [];
}

const createSubTask = ({ id, description, time }) => {
  return `
    <div class="newTask" id="subtask-${id}">
        <div class="description">
        <input
            value="${description}"
            name="subTask-description-${id}"
            id="subTask-description-${id}"
            class="task oldTasksInput"
            type="text"
            placeholder="New task"
            onchange="(() => onChange(${id}, 'description'))()"
        />
        </div>
        <div class="time">
            <input onchange="(() => onChange(${id}, 'time'))()" 
                value="${time}" 
                id="subTask-time-${id}"
                name="subTask-time-${id}" 
                class="task subTasksTime" 
                type="number" 
                placeholder="0" />
        </div>
        <div class="button">
            <button onClick="deleteSubTask(${id})" class="addSubtasks blackButton clearButton">
            <i class="fa fa-plus"></i>
            </button>
        </div> 
    </div>
    `;
};

const onChange = (id, name) => {
  const element = document.getElementById(`subTask-${name}-${id}`);
  const value = element.value;

  subTasks.forEach((item) => {
    if (item.id === id) {
      item[name] = value;
      return item;
    }
  });
};

const createList = (task) => {
  return `
    <div class="taskItem id=${task.id}">
    <div class="taskLogo"></div>
    <div class="taskNameList" >
        <h4>${task.name}</h4>
        <ul>
            ${renderItems(task.subTasks)}
        </ul>
    </div>
        <div class="load">
            <button onClick="loadLocal()" class="clearButton loadButton">Load</button>
        </div>
    </div>
    `;
};

const renderItems = (items) => {
  return items
    .map((item) => `<li>${item.description} - ${item.time}h</li>`)
    .join("");
};

const deleteSubTask = (id) => {
  subTasks = subTasks.filter((item) => item.id !== id);
  addSubTask();
};

const addSubTask = () => {
  newTask.innerHTML = "";
  subTasks.forEach((item) => {
    newTask.innerHTML += createSubTask(item);
  });
};

const fillTask = () => {
  taskList.innerHTML = "";
  if (tasks.length > 0) {
    tasks.forEach((item) => {
      taskList.innerHTML += createList(item);
    });
  }
};

let iterator = 0;
let k = 0;
const loadLocal = () => {
  let newArr = [];
  let ic = 0;
  todoList = JSON.parse(localStorage.getItem("tasks"));
  if (k != 2) {
    k = 2;
    for (const obj of todoList) {
      for (let i = 0; i < tasks.length; i++) {
        if (obj.id !== tasks[i].id) {
          const task = new Task(obj.id, obj.name);
          task.subTasks = obj.subTasks;
          newArr.push(task);
        }
      }
    }
    if (iterator == 1) {
      for (let i = newArr.length - iterator; i >= 0; i--) {
        tasks.push(newArr[i]);
      }
    } else if (iterator > 1) {
      for (let i = newArr.length - iterator - 1; i >= 0; i--) {
        tasks.push(newArr[i]);
      }
    } else {
      alert("Данных в localStorage нет");
    }

    subTasks = [];
    subTasks.push(new SubTask(magicIndex, "", ""));
    addSubTask();
    fillTask();
  } else {
    alert("Все данные выведены.");
  }
  console.log(tasks);
};

let p = 0;
let t = 0;

saveLocal.addEventListener("click", () => {
  let todo = JSON.parse(localStorage.getItem("tasks"));
  let todoList = todo;
  console.log(todo);
  if (taskName.value !== "") {
    const task = new Task(setId(), taskName.value);
    task.subTasks = subTasks;
    tasks.push(task);
    tasks.reverse();
    fillTask();
    taskName.value = "";
    subTasks = [];
    subTasks.push(new SubTask(magicIndex, "", ""));
    addSubTask();
  } else {
    alert("Введите имя задачи!");
  }
  iterator++;
  if (todo === null) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } else {
    for (let i = todoList.length - 1; i <= todoList.length; i++) {
      for (let j = 0; j < tasks.length; j++) {
        if (tasks[j].id !== todoList[i].id) {
          todoList.push(tasks[j]);
        }
      }
      break;
    }
    if (todoList === todo) {
      localStorage.setItem("tasks", JSON.stringify(todoList));
    }
  }
});

subTask.addEventListener("click", () => {
  subTasks.push(new SubTask(magicIndex, "", ""));
  addSubTask();
});

addTask.addEventListener("click", () => {
  k++;
  iterator++;
  if (taskName.value !== "") {
    const task = new Task(setId(), taskName.value);
    task.subTasks = subTasks;
    tasks.push(task);
    tasks.reverse();
    fillTask();
    taskName.value = "";
    subTasks = [];
    subTasks.push(new SubTask(magicIndex, "", ""));
    addSubTask();
  } else {
    alert("Введите имя задачи!");
  }
});

window.onload = () => {
  subTasks.push(new SubTask(magicIndex, "", ""));
  addSubTask();
};
