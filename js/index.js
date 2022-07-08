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

let magicIndex = 0;

function SubTask(id, description, time) {
  this.id = id;
  this.description = description;
  this.time = time;
}

function Task(name, description, time) {
  this.name = name;
  this.description = description;
  this.time = time;
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
    <div class="taskItem">
    <div class="taskLogo"></div>
    <div class="taskNameList">
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
    .map((item) => `<li>${item.description} - ${item.time}</li>`)
    .join("");
};

const deleteSubTask = (id) => {
  subTasks = subTasks.filter((item) => item.id !== id);
  addSubTask();
};

const deleteAllSubTask = (index) => {
  while (subTasks.length > 0) {
    subTasks.splice(index, 1);
    addSubTask();
  }
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

const loadLocal = () => {
  todoList = JSON.parse(localStorage.getItem("tasks"));

  for (const obj of todoList) {
    const task = new Task(obj.name);
    task.subTasks = obj.subTasks;
    tasks.push(task);
    tasks.reverse();
    subTasks = [];
  }
  addSubTask();
  fillTask();
};

const saveLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

saveLocal.addEventListener("click", () => {
  saveLocalStorage();
});

subTask.addEventListener("click", () => {
  magicIndex++;
  subTasks.push(new SubTask(magicIndex, "", ""));
  addSubTask();
});

addTask.addEventListener("click", () => {
  const task = new Task(taskName.value);
  task.subTasks = subTasks;
  magicIndex = 0;
  tasks.push(task);
  tasks.reverse();
  fillTask();
  taskName.value = "";
  subTasks = [];
  addSubTask();
});

window.onload = () => {
  magicIndex++;
  subTasks.push(new SubTask(magicIndex, "", ""));
  addSubTask();
};
