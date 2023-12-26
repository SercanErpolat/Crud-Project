// HTML Elements
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

//Editing options
let editElement; //Represents the item being edited.
let editFlag = false; //Indicates whether it is in edit mode or not.
let editID = ""; //Unique ID.

//Call addItem function when the form is submitted.
form.addEventListener("submit", addItem);

//Call clearItems function when click on clear button.
clearBtn.addEventListener("click", clearItems);

// Call the setupItems function when the page loads.
window.addEventListener("DOMContentLoaded", setupItems);

//FUNCTIONS
function addItem(e) {
  e.preventDefault();
  const value = grocery.value; //Gets the input value of input.
  const id = new Date().getTime.toString();
  if (value !== "" && !editFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id"); //Creates a new data ID.
    attr.value = id;
    element.classList.add("grocery-item");
    element.setAttributeNode(attr);
    // console.log(element);
    element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
            <button class="edit-btn" type="button" >
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="delete-btn" type="button" >
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        `;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
    list.appendChild(element);
    // alert
    displayAlert("Added Successfully", "success");
    // Show container
    container.classList.add("show-container");
    // Adding to Local Storage
    addToLocalStorage(id, value);
    // Clear content
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Value edited", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("Please enter a value!", "danger");
  }
}

// Alert function
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

function setBackToDefault() {
  grocery.value = " ";
  editFlag = false;
  editID = " ";
  submitBtn.textContent = "submit";
}

//Deletion Process
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length == 0) {
    container.classList.remove("show-container");
  }
  displayAlert("Item removed", "danger");
  removeFromLocalStorage(id);
}

// Edit function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id; //The ID of the edited item is updated.
  submitBtn.textContent = "Edit";
}

function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item); // Clears all items in the list.
    });
  }
  container.classList.remove("show-container");
  displayAlert("List Cleared", "danger");
  setBackToDefault();
}

// Get items from local storage
function getLocalStorage() {
  return localStorage.getItem("groceryList")
    ? JSON.parse(localStorage.getItem("groceryList"))
    : [];
}

// Add item to local storage
function addToLocalStorage(id, value) {
  const groceryItem = { id, value };
  let items = getLocalStorage();
  items.push(groceryItem);
  localStorage.setItem("groceryList", JSON.stringify(items));
}

// Edit item in local storage
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("groceryList", JSON.stringify(items));
}

// Remove item from local storage
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    return item.id !== id;
  });
  localStorage.setItem("groceryList", JSON.stringify(items));
}

// Setup items from local storage when the page loads
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      const element = document.createElement("article");
      let attr = document.createAttribute("data-id");
      attr.value = item.id;
      element.classList.add("grocery-item");
      element.setAttributeNode(attr);
      element.innerHTML = `
          <p class="title">${item.value}</p>
          <div class="btn-container">
              <button class="edit-btn" type="button" >
                  <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-btn" type="button" >
                  <i class="fa-solid fa-trash"></i>
              </button>
          </div>
        `;
      const deleteBtn = element.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", deleteItem);
      const editBtn = element.querySelector(".edit-btn");
      editBtn.addEventListener("click", editItem);
      list.appendChild(element);
    });
    container.classList.add("show-container");
  }
}
