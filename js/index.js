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

function Task(id, visible, name) {
  this.id = id;
  this.visible = visible;
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

const loadLocal = () => {
  let todoList = JSON.parse(localStorage.getItem("tasks"));
  let newTodo = [];

  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].visible == false) {
      todoList[i].visible = true;
      newTodo.push(todoList[i]);
    }
  }
  localStorage.setItem("tasks", JSON.stringify(todoList));
  newTodo.map((i) => tasks.push(i));

  subTasks = [];
  subTasks.push(new SubTask(magicIndex, "", ""));
  addSubTask();
  fillTask();
  iterator = 1;
};

function uniqBy(a, key) {
  var seen = {};
  return a.filter(function (item) {
    var k = key(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
}

saveLocal.addEventListener("click", () => {
  if (taskName.value !== "") {
    const task = new Task(setId(), true, taskName.value);
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

  let todo = JSON.parse(localStorage.getItem("tasks"));
  let newTasksList = [];
  if (todo === null) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } else {
    for (let i = 0; i < tasks.length; i++) {
      if (todo.indexOf(tasks[i]) === -1) {
        todo.push(tasks[i]);
      }
    }
    newTasksList = uniqBy(todo, JSON.stringify);
    localStorage.setItem("tasks", JSON.stringify(newTasksList));
  }
});

subTask.addEventListener("click", () => {
  subTasks.push(new SubTask(magicIndex, "", ""));
  addSubTask();
});

addTask.addEventListener("click", () => {
  if (taskName.value !== "") {
    const task = new Task(setId(), true, taskName.value);
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
  let todo = JSON.parse(localStorage.getItem("tasks"));
  if (todo !== null) {
    for (let i = 0; i < todo.length; i++) {
      todo[i].visible = false;
    }
    localStorage.setItem("tasks", JSON.stringify(todo));
  }
  subTasks.push(new SubTask(magicIndex, "", ""));
  addSubTask();
};
