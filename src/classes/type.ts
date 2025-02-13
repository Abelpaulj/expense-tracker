import { Task } from "./list.js";

// Function to get category from URL
function getCategoryFromURL(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("category");
}

// Function to render transactions based on the selected category
function renderCategoryTransactions(category: string | null): void {
  const transactionContainer = document.querySelector(".transactions-all-container") as HTMLElement;
  const categoryHeading = document.querySelector(".type-heading h1");
  const categoryAmountDisplay = document.querySelector(".euro-type");

  if (!transactionContainer || !categoryHeading || !categoryAmountDisplay) {
    console.error("Required elements not found in the DOM.");
    return;
  }

  // If category is not found, redirect back to insights.html
  if (!category) {
    console.error("No category found in URL.");
    transactionContainer.innerHTML = "<p>Invalid category. <a href='insights.html'>Go back</a></p>";
    return;
  }

  // Retrieve all transactions from localStorage
  const transactionsJSON = localStorage.getItem("allTransactions");
  if (!transactionsJSON) {
    transactionContainer.innerHTML = "<p>No transactions found.</p>";
    return;
  }

  const allTasks: Task[] = JSON.parse(transactionsJSON);

  // Filter transactions by the selected category and current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const filteredTasks = allTasks.filter((task) => {
    const taskDate = new Date(task.task_createdAt);
    return (
      task.category === category &&
      taskDate.getMonth() === currentMonth &&
      taskDate.getFullYear() === currentYear
    );
  });

  // Update category name in the heading
  categoryHeading.textContent = category;

  // Calculate total expense for the selected category
  const totalExpense = filteredTasks.reduce((sum, task) => sum + task.amount, 0);
  categoryAmountDisplay.textContent = `-€${totalExpense.toFixed(2)} spent`;

  // If no transactions found, show a message
  if (filteredTasks.length === 0) {
    transactionContainer.innerHTML = "<p>No transactions for this category.</p>";
    return;
  }

  // Render transactions grouped by date
  const groupedTasks = filteredTasks.reduce<Record<string, Task[]>>((acc, task) => {
    const taskDate = new Date(task.task_createdAt);
    const dateKey = taskDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(task);
    return acc;
  }, {});

  transactionContainer.innerHTML = ""; // Clear previous transactions

  Object.entries(groupedTasks).forEach(([key, tasks]) => {
    let sectionHTML = `<section class="transactions"><section><h2>${key}</h2></section>`;

    tasks.forEach((task) => {
      sectionHTML += `
        <section class="transaction">
          <section class="transaction-item">
            <img src="${task.image}" alt="${task.category}">
            <p>${task.category}</p>
          </section>
          <p>-€${task.amount.toFixed(2)}</p>
        </section>
      `;
    });

    sectionHTML += `</section>`;
    transactionContainer.innerHTML += sectionHTML;
  });
}

function updateMonthName() {
  const monthHead = document.querySelector(".Expense");

  if (monthHead) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const currentMonthIndex = new Date().getMonth();
    monthHead.textContent = `Expenses in ${months[currentMonthIndex]}`;
  }
}


// Run when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const selectedCategory = getCategoryFromURL();
  renderCategoryTransactions(selectedCategory);
  updateMonthName();
});

