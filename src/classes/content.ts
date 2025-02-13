import { loadTasksFromLocalStorage } from "../index.js";
import { Task } from "./list.js";

// Function to display transaction details
function displayExpenseDetails(): void {
  const params = new URLSearchParams(window.location.search);
  const expenseId = params.get("id"); // Get the clicked expense ID from URL

  if (!expenseId) {
    console.error("No expense ID found in URL.");
    return;
  }

  const tasks: Task[] = loadTasksFromLocalStorage();

  // Convert `expenseId` to a number to compare correctly
  const expenseIndex = parseInt(expenseId, 10);

  if (isNaN(expenseIndex) || expenseIndex < 0 || expenseIndex >= tasks.length) {
    console.error("Invalid expense index.");
    return;
  }

  const selectedTask = tasks[expenseIndex]; // Get the task by index

  if (!selectedTask) {
    console.error("Expense not found.");
    return;
  }

  // Select elements in the content.html page
  const categoryImage = document.querySelector(".content-items img") as HTMLImageElement | null;
  const categoryTitle = document.querySelector(".content-category") as HTMLHeadingElement | null;
  const amountSpent = document.querySelector(".euro-spent") as HTMLParagraphElement | null;
  const descriptionText = document.querySelector(".Description-para") as HTMLParagraphElement | null;
  const dateText = document.querySelector(".content-items .date-info") as HTMLParagraphElement | null;

  // Convert saved timestamp to a Date object
  const expenseDate = new Date(selectedTask.task_createdAt);

  // ✅ Format Date in German (Without Time)
  const formattedDate = expenseDate.toLocaleDateString("de-DE", {
    weekday: "long", // e.g., Montag, Dienstag
    day: "numeric",
    month: "long", // e.g., Januar, Februar
    year: "numeric",
  });

  // Convert numerical values to string before assignment
  if (categoryImage) categoryImage.src = selectedTask.image;
  if (categoryTitle) categoryTitle.textContent = selectedTask.category.toString(); // Convert to string
  if (amountSpent) amountSpent.textContent = `-€${Number(selectedTask.amount).toFixed(2)}`; // Convert to number first
  if (descriptionText) descriptionText.textContent = selectedTask.description?.toString() ?? "Keine Beschreibung verfügbar"; // Convert if exists
  if (dateText) dateText.textContent = formattedDate; // 
}

// Run function when the page loads
document.addEventListener("DOMContentLoaded", displayExpenseDetails);
