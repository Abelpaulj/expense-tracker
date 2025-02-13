import { saveTasksToLocalStorage } from "../index.js";
export function addTaskButton(tasks, renderToDoList) {
    const categoryInput = document.querySelector("#categoryDropdown");
    const descriptionInput = document.querySelector(".Description");
    const dateInput = document.querySelector("#purchaseDateInput");
    const amountInput = document.querySelector(".Amount");
    // Ensure the presence of required input fields
    if (!categoryInput || !descriptionInput || !dateInput || !amountInput) {
        console.error("One or more input fields are missing.");
        return;
    }
    // Ensure all inputs are valid
    if (!categoryInput.value || !descriptionInput.value.trim() || !dateInput.value || parseFloat(amountInput.value) <= 0) {
        alert("Please fill all fields correctly.");
        return;
    }
    // Determine the appropriate image path
    const imagePath = (() => {
        switch (categoryInput.value) {
            case "Food":
                return "img/food.png";
            case "Entertainment":
                return "img/entertainment.png";
            case "Transport":
                return "img/transport.png";
            case "Groceries":
                return "img/groceries.png";
            default:
                return "img/default.png";
        }
    })();
    // Create a new task object
    const newTask = {
        category: categoryInput.value,
        description: descriptionInput.value.trim(),
        task_createdAt: dateInput.value,
        amount: parseFloat(amountInput.value),
        image: imagePath,
    };
    // Add the task to the list and clear inputs
    tasks.unshift(newTask);
    categoryInput.value = "";
    descriptionInput.value = "";
    dateInput.value = "";
    amountInput.value = "";
    // Update the UI and save tasks to local storage
    renderToDoList(tasks);
    saveTasksToLocalStorage(tasks);
}
