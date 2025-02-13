import { updateBudgetDisplay,sendBudgetNotification } from "./insights.js";


document.addEventListener("DOMContentLoaded", () => {
  // Select elements from the DOM
  const budgetInput = document.querySelector<HTMLInputElement>(".euro-input input");
  const saveButton = document.querySelector<HTMLButtonElement>(".budget-btn");
  const deleteButton = document.querySelector<HTMLButtonElement>(".budget-delete");

  // Constant for the storage key
  const BUDGET_KEY = "monthlyBudget";

  // Function to save the budget
  const saveBudget = (amount: string): void => {
    localStorage.setItem(BUDGET_KEY, amount);
    updatePlaceholder(amount);
  
    // Calculate and notify if budget is low
    const totalBudget = parseFloat(amount);
    const remainingBudget = totalBudget; // When saving, the remaining budget equals the total
    sendBudgetNotification(remainingBudget, totalBudget);
  
    alert(`Monthly budget saved: €${amount}`);
  };

  // Function to load the budget
  const loadBudget = (): string | null => {
    return localStorage.getItem(BUDGET_KEY);
  };

  // Function to delete the budget
  const deleteBudget = (): void => {
    localStorage.removeItem(BUDGET_KEY);
    updatePlaceholder(null);
    // Update the budget display
  updateBudgetDisplay();
    alert("Monthly budget deleted.");
  };

  // Function to update the placeholder
  const updatePlaceholder = (amount: string | null): void => {
    if (budgetInput) {
      budgetInput.placeholder = amount ? amount : "0.00";
    }
  };

  // Initialize the input with the stored budget
  updatePlaceholder(loadBudget());

  // Event listener for the Save button
  saveButton?.addEventListener("click", () => {
    if (budgetInput && budgetInput.value) {
      const newBudget = parseFloat(budgetInput.value).toFixed(2); // Format as 2-decimal string
      saveBudget(newBudget);
      budgetInput.value = ""; // Clear the input field
    } else {
      alert("Please enter a valid amount to save.");
    }
  });

  // Event listener for the Delete button
  deleteButton?.addEventListener("click", deleteBudget);
});
