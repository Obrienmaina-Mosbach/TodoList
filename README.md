# Vue.js To-Do List Application

This is a To-Do list application built with Vue.js 3, demonstrating component-based architecture, props, and custom events for communication between parent and child components.

**Note:** This is a client-side application. All To-Do items are stored in the browser's memory and will be reset upon refreshing the page. It does not connect to a backend database like MongoDB.

## Features

* Add new To-Do items with a title and optional description.
* Display a list of all To-Do items.
* Mark To-Do items as completed or pending using a checkbox.
* Delete To-Do items from the list.
* Responsive design using Tailwind CSS.
* Visually appealing interface with Font Awesome icons.

## Project Structure


```
vue-todo-list/
                ├── public/
                    └── index.html        
                ├── src/
                   ├── assets/           
                   ├── components/        
                      └── TodoItem.vue   
                   ├── App.vue            
                   └── main.js            
                ├── package.json           
                └── README.md              
```


## Setup and Running the Project

To run this project locally, you need to have Node.js and npm (or Yarn) installed on your machine.

1.  **Clone or Download the Project:**
    If you have a project folder, navigate to it. Otherwise, create the files above in a new directory named `vue-todo-list`.

2.  **Install Dependencies:**
    Navigate to the `vue-todo-list` directory in your terminal and install the required Node.js packages:

    ```bash
    npm install
    # OR
    yarn install
    ```

3.  **Run the Development Server:**
    Start the development server. This will compile your Vue application and serve it locally, usually on `http://localhost:8080/`.

    ```bash
    npm run serve
    # OR
    yarn serve
    ```

    Your To-Do list application should now be accessible in your web browser.


## Technologies Used

* **Vue.js 3:** The progressive JavaScript framework for building user interfaces.
* **Vue CLI:** Standard tooling for rapid Vue.js development.
* **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
* **Font Awesome:** For scalable vector icons.

## Component Communication

* **`App.vue` (Parent) to `TodoItem.vue` (Child):**
    * `App.vue` passes a `todo` object as a `prop` to `TodoItem.vue`. This allows the child component to display the specific details of each To-Do item.

* **`TodoItem.vue` (Child) to `App.vue` (Parent):**
    * `TodoItem.vue` emits custom events (`toggle-done` and `delete-todo`) when a user interacts with the checkbox or delete button.
    * `App.vue` listens for these events and executes corresponding methods (`toggleTodoStatus` and `deleteTodo`) to update its `todos` data array.


