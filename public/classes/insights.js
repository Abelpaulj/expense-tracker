import { loadTasksFromLocalStorage } from "../index.js";
import { renderPieChart } from "./chart.js";
// Function to calculate remaining budget for the current month
export function calculateRemainingBudget(budgetKey) {
    const budget = parseFloat(localStorage.getItem(budgetKey) || "0");
    const tasks = loadTasksFromLocalStorage();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    // Filter tasks for the current month and year
    const filteredTasks = tasks.filter((task) => {
        const taskDate = new Date(task.task_createdAt);
        return (taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear);
    });
    const totalExpenses = filteredTasks.reduce((sum, task) => sum + (task.amount || 0), 0);
    return Math.max(0, budget - totalExpenses); // Ensure it doesn't go below 0
}
// Function to send notifications
export function sendBudgetNotification(remainingBudget, totalBudget) {
    const threshold = 0.2; // 20% of the budget
    if (remainingBudget <= totalBudget * threshold) {
        alert("Warning: Your remaining budget is less than 20%!");
    }
}
// Function to update the budget display in the HTML
export function updateBudgetDisplay() {
    const remainingBudget = calculateRemainingBudget("monthlyBudget");
    const euroLeftElements = document.querySelectorAll(".euro-left");
    euroLeftElements.forEach((element) => {
        // Check if the element belongs to the home page section
        if (element.closest(".home-page-container")) {
            // In Home Page → Display only the number and € symbol
            element.textContent = `€${remainingBudget.toFixed(2)}`;
        }
        else {
            // In other pages → Display with "left"
            element.textContent = `€${remainingBudget.toFixed(2)} left`;
        }
    });
    const budget = parseFloat(localStorage.getItem("monthlyBudget") || "0");
    const notificationSent = localStorage.getItem("notificationSent");
    if (remainingBudget <= budget * 0.2 && remainingBudget > 0 && !notificationSent) {
        sendBudgetNotification(remainingBudget, budget);
        // Mark notification as sent
        localStorage.setItem("notificationSent", "true");
    }
    if (remainingBudget > budget * 0.2) {
        localStorage.removeItem("notificationSent");
    }
}
// Event listener for task updates
export function onTaskUpdated() {
    updateBudgetDisplay();
    updateCategoryBreakdown();
}
function updateMonthName() {
    const monthHead = document.querySelector(".month-head h2");
    if (monthHead) {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const currentMonthIndex = new Date().getMonth();
        monthHead.textContent = months[currentMonthIndex];
    }
}
function updateCategoryBreakdown() {
    const tasks = loadTasksFromLocalStorage();
    const categoryBreakdownContainer = document.querySelector(".Breakdown");
    if (!categoryBreakdownContainer)
        return;
    // Clear previous content
    categoryBreakdownContainer.innerHTML = "";
    if (!tasks || tasks.length === 0) {
        categoryBreakdownContainer.innerHTML = "<p>No transactions found.</p>";
        return;
    }
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    // Object to store total expenses per category
    const categoryTotals = {};
    // Calculate expenses per category for the current month
    tasks.forEach((task) => {
        const taskDate = new Date(task.task_createdAt);
        if (taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear) {
            if (!categoryTotals[task.category]) {
                categoryTotals[task.category] = 0;
            }
            categoryTotals[task.category] += task.amount;
        }
    });
    // Populate the category breakdown section
    Object.keys(categoryTotals).forEach((category) => {
        // Create category wrapper
        const categoryItem = document.createElement("div");
        categoryItem.classList.add("breakdown-things");
        // Create a flex container for icon, name, and amount
        const categoryContent = document.createElement("div");
        categoryContent.style.display = "flex";
        categoryContent.style.justifyContent = "space-between";
        categoryContent.style.alignItems = "center";
        categoryContent.style.width = "100%";
        // Create category image
        const categoryIcon = document.createElement("img");
        categoryIcon.src = `img/${category.toLowerCase()}.png`;
        categoryIcon.alt = category;
        categoryIcon.style.marginRight = "10px";
        // Create category name
        const categoryText = document.createElement("p");
        categoryText.classList.add("type");
        categoryText.textContent = category;
        categoryText.style.flexGrow = "1";
        // Create total spend amount
        const categoryAmount = document.createElement("p");
        categoryAmount.classList.add("euro-break");
        categoryAmount.textContent = `-€${categoryTotals[category].toFixed(2)}`;
        //
        // Create clickable link to `type.html`
        const categoryLink = document.createElement("a");
        categoryLink.href = `type.html?category=${encodeURIComponent(category)}`;
        categoryLink.style.textDecoration = "none";
        categoryLink.style.color = "inherit";
        categoryLink.style.width = "100%";
        // Append elements inside categoryContent
        categoryContent.appendChild(categoryIcon);
        categoryContent.appendChild(categoryText);
        categoryContent.appendChild(categoryAmount);
        // Append categoryContent inside categoryItem
        categoryItem.appendChild(categoryContent);
        // Append categoryItem to categoryLink
        categoryLink.appendChild(categoryItem);
        // Append categoryLink to Breakdown container
        categoryBreakdownContainer.appendChild(categoryLink);
    });
}
// Initialize budget and category breakdown on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    updateBudgetDisplay();
    updateMonthName();
    updateCategoryBreakdown();
    updateDaysLeft();
    renderPieChart();
});
//days left 
function updateDaysLeft() {
    const daysLeftElement = document.querySelector(".days-left");
    if (!daysLeftElement)
        return;
    // Get current date
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    // Get the last day of the current month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // Calculate remaining days
    const daysRemaining = lastDayOfMonth - today.getDate();
    // Update the text content dynamically
    daysLeftElement.textContent = `${daysRemaining} days to go`;
}
//loading
function updateBudgetProgress() {
    const budget = parseFloat(localStorage.getItem("monthlyBudget") || "0");
    const tasks = loadTasksFromLocalStorage();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    // Filter tasks for the current month and year
    const filteredTasks = tasks.filter((task) => {
        const taskDate = new Date(task.task_createdAt);
        return (taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear);
    });
    const totalExpenses = filteredTasks.reduce((sum, task) => sum + (task.amount || 0), 0);
    const percentageSpent = (totalExpenses / budget) * 100;
    // Update the circular progress bar
    const circle = document.querySelector(".circle");
    const percentageText = document.querySelector(".percentage");
    if (circle && percentageText) {
        const circumference = 2 * Math.PI * 15.9155; // Radius of the circle
        const dashOffset = circumference * (1 - percentageSpent / 100);
        // Set the stroke-dasharray to show only the spent portion
        circle.style.strokeDasharray = `${circumference * (percentageSpent / 100)}, ${circumference}`;
        percentageText.textContent = `${Math.round(percentageSpent)}%`;
    }
}
// Call this function when the page loads or when the budget is updated
document.addEventListener("DOMContentLoaded", () => {
    updateBudgetProgress();
});
