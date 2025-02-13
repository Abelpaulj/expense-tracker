import { Task } from "./classes/list.js";
import { updateBudgetDisplay } from "./classes/insights.js";
import { addTaskButton } from "./classes/home.js"; // Import the function from home.ts
import { calculateRemainingBudget } from "./classes/insights.js";
import { setupFilterPanel, setupSearch, setupCategorySelection, setupApplyFilter } from "./classes/filter.js";


export function loadTasksFromLocalStorage(): Task[] {
  const tasksJSON = localStorage.getItem("tasks");
  return tasksJSON ? JSON.parse(tasksJSON) : [];
}

export function saveTasksToLocalStorage(tasks: Task[]): void {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateBudgetDisplay();
  updateRemainingBalance();
}

export function renderToDoList(tasks: Task[]): void {
  const taskContainer = document.querySelector("#transaction-ts") as HTMLElement;

  if (!taskContainer) {
    console.error("Task container not found in the DOM.");
    return;
  }

  taskContainer.innerHTML = ""; // Clear any previous content

  if (!tasks || tasks.length === 0) {
    taskContainer.innerHTML = "<p>No transactions to display.</p>";
    return;
  }

  // Limit tasks to the latest 5
  const latestTasks = tasks.slice(0, 5);

  let todoListHTML = "";
  latestTasks.forEach((task,index) => {
    const amount = task.amount ?? 0;

    todoListHTML += `
    <a href="content.html?id=${index}" style="text-decoration: none; color: inherit;">
      <section class="transaction">
        <section class="transaction-item">
          <img src="${task.image}" alt="transactions">
          <p>${task.category}</p>
        </section>
        <p>-&euro;${amount.toFixed(2)}</p>
      </section>
    </a>`;
  });

  taskContainer.innerHTML = todoListHTML;
}
function updateRemainingBalance(): void {
  const remainingBalanceElement = document.querySelector(".remaining-balance") as HTMLElement;

  if (!remainingBalanceElement) {
    console.error("Remaining balance element not found in the DOM.");
    return;
  }

  // Calculate the remaining budget
  const remainingBudget = calculateRemainingBudget("monthlyBudget");
  // Update the remaining balance display
  remainingBalanceElement.textContent = `€${remainingBudget.toFixed(2)}`;
}
// Load tasks from local storage and render the latest 5 on page load
const tasks = loadTasksFromLocalStorage();
renderToDoList(tasks);
updateRemainingBalance();  

// Add click event listener to the "Add Task" button
const addButton = document.querySelector("#addTaskButton") as HTMLButtonElement | null;

if (addButton) {
  addButton.addEventListener("click", () => {
    addTaskButton(tasks, renderToDoList); // Call the imported function
    
  });
} else {
  console.error("Add Task button not found in the DOM.");
}

document.addEventListener("DOMContentLoaded", () => {
  setupFilterPanel();
  setupSearch();
  setupCategorySelection();
  setupApplyFilter();
});

