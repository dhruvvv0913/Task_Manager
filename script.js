// ----- Data -----
// Each task is an object like: { id: 123, text: "Buy milk", completed: false }
let tasks = [];
let currentFilter = "all"; // can be "all", "active", or "completed"

// ----- Page elements we need -----
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("errorMessage");
const emptyMessage = document.getElementById("emptyMessage");
const counter = document.getElementById("counter");
const clearButton = document.getElementById("clearCompleted");
const themeToggle = document.getElementById("themeToggle");
const filterButtons = document.querySelectorAll(".filter-btn");

// ----- Events -----
// Add a task when the button is clicked
addButton.addEventListener("click", addTask);

// Add a task when the Enter key is pressed inside the input box
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Remove all completed tasks at once
clearButton.addEventListener("click", clearCompleted);

// Switch between dark and light mode
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  saveTheme();
  updateThemeButton();
});

// Make the three filter buttons work
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Remember which filter the user picked
    currentFilter = button.dataset.filter;

    // Highlight the chosen button and un-highlight the others
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    renderTasks();
  });
});

// ----- Functions -----

// Add a new task to the list
function addTask() {
  const taskText = taskInput.value.trim();

  // If the box is empty, show a message and stop
  if (taskText === "") {
    errorMessage.textContent = "Please type a task first.";
    return;
  }

  // Clear any old error message
  errorMessage.textContent = "";

  // Add the new task to our array
  tasks.push({
    id: Date.now(), // a simple unique id based on the current time
    text: taskText,
    completed: false
  });

  saveTasks();
  renderTasks();

  // Clear the box and put the cursor back in it
  taskInput.value = "";
  taskInput.focus();
}

// Mark a task as done or not done
function toggleTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
  });
  saveTasks();
  renderTasks();
}

// Change the text of a task
function editTask(id) {
  // Find the task we want to edit
  const task = tasks.find(function (t) {
    return t.id === id;
  });

  // Ask for the new text, starting from the current text
  const newText = prompt("Edit your task:", task.text);

  // Do nothing if the user pressed Cancel or left it empty
  if (newText === null || newText.trim() === "") {
    return;
  }

  task.text = newText.trim();
  saveTasks();
  renderTasks();
}

// Remove a single task from the list
function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
}

// Remove every task that is marked as completed
function clearCompleted() {
  tasks = tasks.filter(function (task) {
    return task.completed === false;
  });
  saveTasks();
  renderTasks();
}

// Show the tasks on the page
function renderTasks() {
  // Clear the list so we can rebuild it from scratch
  taskList.innerHTML = "";

  // Decide which tasks to show based on the chosen filter
  const visibleTasks = tasks.filter(function (task) {
    if (currentFilter === "active") {
      return task.completed === false;
    }
    if (currentFilter === "completed") {
      return task.completed === true;
    }
    return true; // "all"
  });

  // Show a helpful message when there is nothing to display
  if (visibleTasks.length === 0) {
    if (tasks.length === 0) {
      emptyMessage.textContent = "No tasks yet. Add one above!";
    } else {
      emptyMessage.textContent = "No tasks in this filter.";
    }
  } else {
    emptyMessage.textContent = "";
  }

  // Build a row for each visible task
  visibleTasks.forEach(function (task) {
    const li = document.createElement("li");
    if (task.completed) {
      li.classList.add("completed");
    }

    // Checkbox to mark the task as done
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    // The task text
    const span = document.createElement("span");
    span.textContent = task.text;

    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    editButton.addEventListener("click", function () {
      editTask(task.id);
    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", function () {
      deleteTask(task.id);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });

  updateCounter();
}

// Update the counter text and show/hide the "Clear completed" button
function updateCounter() {
  const total = tasks.length;
  const done = tasks.filter(function (task) {
    return task.completed;
  }).length;

  if (total === 0) {
    counter.textContent = "";
  } else {
    counter.textContent = done + " of " + total + " tasks completed";
  }

  // Only show the "Clear completed" button when something is completed
  if (done > 0) {
    clearButton.classList.remove("hidden");
  } else {
    clearButton.classList.add("hidden");
  }
}

// Save the tasks array into the browser's storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load the tasks array from the browser's storage when the page opens
function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved !== null) {
    tasks = JSON.parse(saved);
  }
  renderTasks();
}

// Save whether the user is using dark mode
function saveTheme() {
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

// Change the toggle button text to match the current theme
function updateThemeButton() {
  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "Light";
  } else {
    themeToggle.textContent = "Dark";
  }
}

// Decide which theme to use when the page opens (dark by default)
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme !== "light") {
    document.body.classList.add("dark");
  }
  updateThemeButton();
}

// Start the app
loadTheme();
loadTasks();
taskInput.focus();
