import { Task } from "./list.js";
import { updateBudgetDisplay } from "./insights.js";
import { setupFilterPanel, setupSearch,setupCategorySelection,setupApplyFilter} from "./filter.js";

export function renderTransactions(tasks: Task[], isFiltered: boolean = false): void {
  const transactionContainer = document.querySelector(".transactions-all-container") as HTMLElement;

  if (!transactionContainer) {
    console.error("❌ Element with class 'transactions-all-container' not found in the DOM.");
    return;
  }

  transactionContainer.innerHTML = ""; // Clear previous content

  if (!tasks || tasks.length === 0) {
    transactionContainer.innerHTML = `<p>No ${isFiltered ? "filtered" : "available"} transactions found.</p>`;
    return;
  }

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // ✅ Group tasks by date
  const groupedTasks: Record<string, { task: Task; index: number }[]> = {};

  tasks.forEach((task, index) => {
    const taskDate = new Date(task.task_createdAt);
    const dateKey =
      taskDate.toDateString() === today.toDateString()
        ? "Today"
        : taskDate.toDateString() === yesterday.toDateString()
        ? "Yesterday"
        : taskDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    if (!groupedTasks[dateKey]) groupedTasks[dateKey] = [];
    groupedTasks[dateKey].push({ task, index });
  });

  // ✅ Save transactions for reuse in other pages
  localStorage.setItem("allTransactions", JSON.stringify(tasks));

  // ✅ Render Transactions with Clickable Entries
  Object.entries(groupedTasks).forEach(([key, taskEntries]) => {
    let sectionHTML = `<section class="transactions"><section><h2>${key}</h2></section>`;

    taskEntries.forEach(({ task, index }) => {
      sectionHTML += `
        <a href="content.html?id=${index}" style="text-decoration: none; color: inherit;">
          <section class="transaction">
            <section class="transaction-item">
              <img src="${task.image}" alt="${task.category}">
              <p>${task.category}</p>
            </section>
            <p>-&euro;${task.amount.toFixed(2)}</p>
          </section>
        </a>
      `;
    });

    sectionHTML += `</section>`;
    transactionContainer.innerHTML += sectionHTML;
  });
}


// Load transactions when DOM is ready

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM Loaded. Initializing See All Page.");

  const urlParams = new URLSearchParams(window.location.search);
  const isSearch = urlParams.has("search");
  const isFiltered = urlParams.has("filtered");

  let tasks: Task[] = [];

  if (isSearch) {
    tasks = JSON.parse(localStorage.getItem("searchResults") || "[]");
    console.log("🔍 Showing Search Results:", tasks);
  } else if (isFiltered) {
    tasks = JSON.parse(localStorage.getItem("filteredResults") || "[]");
    console.log("🔍 Showing Filtered Results:", tasks);
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    console.log("📁 Showing All Transactions:", tasks);
  }

  renderTransactions(tasks, isSearch || isFiltered);
  updateBudgetDisplay();
  setupFilterPanel();
  setupSearch();
  setupCategorySelection();
  setupApplyFilter();
});
