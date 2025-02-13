
import { loadTasksFromLocalStorage } from "../index.js";
import { calculateRemainingBudget } from "./insights.js";

declare const Chart: any;
export function renderPieChart() {
  const tasks = loadTasksFromLocalStorage();
  const budget = parseFloat(localStorage.getItem("monthlyBudget") || "0");
  const remainingBudget = calculateRemainingBudget("monthlyBudget");

  // ✅ Step 1: Calculate Expenses Per Category
  const categoryTotals: Record<string, number> = {};
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  tasks.forEach((task) => {
    const taskDate = new Date(task.task_createdAt);
    if (taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear) {
      if (!categoryTotals[task.category]) {
        categoryTotals[task.category] = 0;
      }
      categoryTotals[task.category] += task.amount;
    }
  });

  // ✅ Step 2: Prepare Chart Data
  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  // ✅ Step 3: Add Remaining Budget
  categories.push("Remaining Budget");
  amounts.push(remainingBudget);

  // ✅ Step 4: Define Colors for Each Category
  const colors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
    "#9966FF", "#FF9F40", "#8A2BE2", "#CCCCCC"
  ];

  // ✅ Step 5: Render Pie Chart
  const ctx = document.getElementById("budgetPieChart") as HTMLCanvasElement | null;
  
  if (!ctx) {
    console.error("Pie chart canvas not found.");
    return;
  }

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [{ data: amounts, backgroundColor: colors }],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });
}