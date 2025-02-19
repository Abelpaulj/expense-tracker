import { Task } from "./list.js";

//  SEARCH FUNCTIONALITY
export function setupSearch() {
  const searchInput = document.querySelector<HTMLInputElement>(".search-items input");
  const searchButton = document.querySelector<HTMLButtonElement>(".search-button");

  if (!searchInput || !searchButton) {
    console.error("❌ Search input or button not found.");
    return;
  }

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();

    if (query === "") {
      alert("Please enter a search term.");
      return;
    }

    // Get transactions from LocalStorage
    const tasksJSON = localStorage.getItem("tasks");
    const tasks: Task[] = tasksJSON ? JSON.parse(tasksJSON) : [];

    //  Convert `task.amount` to a string before calling `toLowerCase()`
    const filteredTasks = tasks.filter((task) =>
      task.category.toLowerCase().includes(query) ||
      (typeof task.description === "string" && task.description.toLowerCase().includes(query)) ||
      task.amount.toString().includes(query)
    );

    if (filteredTasks.length === 0) {
      alert("No matching transactions found.");
      return;
    }

    //  Store filtered results in LocalStorage
    localStorage.setItem("searchResults", JSON.stringify(filteredTasks));

    //  Redirect to "See All" page
    window.location.href = "seeall.html?search=true";
  });
}

// FILTER PANEL FUNCTIONALITY
export function setupFilterPanel() {
  const filterPanel = document.querySelector(".filter-panel");
  const filterButton = document.querySelector(".filter-button");
  const closeButton = document.querySelector(".close-filter");

  if (!filterPanel || !filterButton || !closeButton) {
    console.error("Filter panel elements not found.");
    return;
  }

  filterButton.addEventListener("click", () => {
    filterPanel.classList.add("open");
  });

  closeButton.addEventListener("click", () => {
    filterPanel.classList.remove("open");
  });

  document.addEventListener("click", (event) => {
    const targetElement = event.target as Node;
    if (!filterPanel.contains(targetElement) && event.target !== filterButton) {
      filterPanel.classList.remove("open");
    }
  });
}

// ✅ CATEGORY SELECTION FUNCTIONALITY
export function setupCategorySelection() {
  const categoryDropdown = document.querySelector(".category-dropdown") as HTMLSelectElement;
  const selectedCategoriesContainer = document.getElementById("selectedCategoriesContainer") as HTMLElement;
  

  if (!categoryDropdown || !selectedCategoriesContainer) {
    console.error("Category elements not found.");
    return;
  }

  let selectedCategories: string[] = [];

  categoryDropdown.addEventListener("change", () => {
    const selectedValue = categoryDropdown.value;

    if (selectedValue && !selectedCategories.includes(selectedValue)) {
      selectedCategories.push(selectedValue);
      updateSelectedCategories();
    }

    categoryDropdown.value = ""; // Reset dropdown
  });

  function updateSelectedCategories() {
    selectedCategoriesContainer.innerHTML = "";
    selectedCategories.forEach((category) => {
      const categoryTag = document.createElement("div");
      categoryTag.classList.add("category-tag");
      categoryTag.textContent = category;

      const removeButton = document.createElement("span");
      removeButton.textContent = " ×";
      removeButton.classList.add("remove-category");
      removeButton.addEventListener("click", () => {
        selectedCategories = selectedCategories.filter((c) => c !== category);
        updateSelectedCategories();
      });

      categoryTag.appendChild(removeButton);
      selectedCategoriesContainer.appendChild(categoryTag);
    });
  }
}

// ✅ APPLY FILTER FUNCTIONALITY
export function setupApplyFilter() {
  const applyFilterButton = document.querySelector(".apply-filter") as HTMLButtonElement;

  if (!applyFilterButton) {
    console.error("❌ Apply filter button not found.");
    return;
  }

  applyFilterButton.addEventListener("click", () => {
    console.log("✅ Apply filter button clicked.");

    // ✅ Get selected categories
    const selectedCategories: string[] = Array.from(
      document.querySelectorAll(".selected-categories .category-tag")
    ).map((tag) => tag.textContent?.replace(" ×", "") || "");

    // ✅ Get date range inputs
    const fromDateInput = document.querySelector(".date.from") as HTMLInputElement;
    const toDateInput = document.querySelector(".date.to") as HTMLInputElement;

    const fromDate = fromDateInput?.value ? new Date(fromDateInput.value).toISOString() : "";
    const toDate = toDateInput?.value ? new Date(toDateInput.value).toISOString() : "";

    // ✅ Get amount range inputs (Convert inputs to numbers)
    const minAmountInput = document.querySelector(".amount.min") as HTMLInputElement;
    const maxAmountInput = document.querySelector(".amount.max") as HTMLInputElement;

    const minAmount = minAmountInput?.value ? parseFloat(minAmountInput.value) : 0; // ✅ Default to 0
    const maxAmount = maxAmountInput?.value ? parseFloat(maxAmountInput.value) : Infinity; // ✅ Default to Infinity

    // ✅ Get transactions from LocalStorage
    const tasksJSON = localStorage.getItem("tasks");
    if (!tasksJSON) {
      console.error("❌ No transactions found in localStorage.");
      return;
    }

    const tasks: Task[] = JSON.parse(tasksJSON);

    console.log("✅ Transactions from localStorage:", tasks);

    // ✅ Ensure amount is treated as a number during filtering
    const filteredTasks = tasks.filter((task: Task) => {
      const taskAmount = typeof task.amount === "string" ? parseFloat(task.amount) : task.amount; // ✅ Convert string to number
      const taskDate = new Date(task.task_createdAt).toISOString();

      return (
        (selectedCategories.length === 0 || selectedCategories.includes(task.category)) &&
        (fromDate === "" || taskDate >= fromDate) &&
        (toDate === "" || taskDate <= toDate) &&
        (taskAmount >= minAmount && taskAmount <= maxAmount) // ✅ Ensure correct number filtering
      );
    });

    console.log("✅ Filtered Transactions:", filteredTasks);

    if (filteredTasks.length === 0) {
      alert("No matching transactions found.");
      return;
    }

    //  Save filtered results to LocalStorage
    localStorage.setItem("filteredResults", JSON.stringify(filteredTasks));

    //  Redirect to See All Page with filter query
    window.location.href = "seeall.html?filtered=true";
  });
}




// ✅ Initialize functions when the DOM loads
document.addEventListener("DOMContentLoaded", () => {
  setupFilterPanel();
  setupSearch();
  setupCategorySelection();
  setupApplyFilter();
});
