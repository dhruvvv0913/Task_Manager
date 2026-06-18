// Get the parts of the page we need to work with
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

// When the "Add" button is clicked, run the addTask function
addButton.addEventListener("click", addTask);

// This function adds one new task to the list
function addTask() {
  // Read what the user typed and remove extra spaces
  const taskText = taskInput.value.trim();

  // If the box is empty, stop here and tell the user
  if (taskText === "") {
    alert("Please type a task first.");
    return;
  }

  // Create a new list item (one row in the list)
  const li = document.createElement("li");

  // Create a span to hold the task text
  const span = document.createElement("span");
  span.textContent = taskText;

  // Create the "Done" button
  const doneButton = document.createElement("button");
  doneButton.textContent = "Done";
  doneButton.className = "done-btn";

  // Create the "Delete" button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-btn";

  // When "Done" is clicked, switch the completed style on or off
  doneButton.addEventListener("click", function () {
    li.classList.toggle("completed");
  });

  // When "Delete" is clicked, remove this task from the list
  deleteButton.addEventListener("click", function () {
    taskList.removeChild(li);
  });

  // Put the text and buttons inside the list item
  li.appendChild(span);
  li.appendChild(doneButton);
  li.appendChild(deleteButton);

  // Put the finished list item into the list on the page
  taskList.appendChild(li);

  // Clear the input box so it is ready for the next task
  taskInput.value = "";
}
