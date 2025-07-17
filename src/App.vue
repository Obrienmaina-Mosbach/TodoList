<!-- App.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center py-10 font-inter">
    <!-- Background Video -->
    <video autoplay loop muted playsinline class="background-video">
      <source src="./assets/2235282-hd_1278_720_30fps.mp4" type="video/mp4">
      <!-- Fallback for browsers that do not support the video tag -->
      Your browser does not support the video tag.
    </video>

    <div class="container bg-white rounded-xl shadow-xl p-8 md:p-12 max-w-2xl w-full relative z-10">
      <!-- Header Section -->
      <header class="text-center mb-10">
        <h1 class="text-4xl font-bold text-emerald-600 flex items-center justify-center gap-4">
          <i class="fas fa-clipboard-list text-blue-500"></i>
          Brian's To-Do List (Vue.js)
        </h1>
      </header>

      <!-- Add New Task Section -->
      <section class="mb-8 pb-6 border-b border-gray-200">
        <h2 class="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3">
          <i class="fas fa-plus-circle text-yellow-500"></i>
          Add New Task
        </h2>
        <form @submit.prevent="addTodo" class="flex flex-col md:flex-row gap-4 flex-wrap">
          <input
            type="text"
            v-model="newTaskName"
            placeholder="Task Title"
            required
            class="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 min-w-[150px]"
          />
          <input
            type="text"
            v-model="newTaskDescription"
            placeholder="Task Description (Optional)"
            class="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 min-w-[150px]"
          />
          <input
            type="datetime-local"
            v-model="newTodoDueDate"
            class="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 min-w-[200px]"
          />
          <button
            type="submit"
            class="px-6 py-3 bg-emerald-500 text-black font-semibold rounded-lg shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 transition duration-200 flex items-center justify-center gap-2 w-full md:w-auto"
          >
            <i class="fas fa-plus"></i>
            Add Task
          </button>
        </form>
      </section>

      <!-- Current Tasks Section -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3">
          <i class="fas fa-tasks text-orange-500"></i>
          Current Tasks
        </h2>
        <ul class="space-y-4">
          <li v-if="todos.length === 0" class="text-center text-gray-500 italic p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            No tasks yet! Add one above.
          </li>
          <TodoItem
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            @toggle-done="toggleTodoStatus"
            @delete-todo="deleteTodo"
          />
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TodoItem from './components/TodoItem.vue'; // Corrected import path

// Reactive state for the list of todos
const todos = ref([
  { id: 1, taskName: 'Learn Vue 3 Basics', taskDescription: 'Understand components, props, and events.', status: 'pending', dueDate: null },
  { id: 2, taskName: 'Build a To-Do App', taskDescription: 'Apply learned concepts to a practical project.', status: 'completed', dueDate: new Date('2025-07-20T10:00').toISOString().slice(0, 16) },
  { id: 3, taskName: 'Explore Vue Router', taskDescription: 'Learn how to navigate between different views.', status: 'pending', dueDate: new Date('2025-07-25T14:30').toISOString().slice(0, 16) }
]);

// Reactive state for new task input fields
const newTaskName = ref('');
const newTaskDescription = ref('');
const newTodoDueDate = ref(''); // New ref for due date
let nextId = todos.value.length > 0 ? Math.max(...todos.value.map(t => t.id)) + 1 : 1;

/**
 * Adds a new todo item to the list.
 * @param {Event} event - The form submission event.
 */
const addTodo = () => {
  if (newTaskName.value.trim() === '') {
    // Basic client-side validation
    alert('Task title cannot be empty!'); // Using alert for simplicity, a real app would use a modal or toast
    return;
  }

  // Create a new todo object
  const newTodo = {
    id: nextId++, // Assign a unique ID
    taskName: newTaskName.value.trim(),
    taskDescription: newTaskDescription.value.trim(),
    // Store dueDate as null if empty, or as a string from datetime-local input
    dueDate: newTodoDueDate.value || null,
    status: 'pending' // New tasks are always pending
  };

  // Add the new todo to the beginning of the array
  todos.value.unshift(newTodo);

  // Clear the input fields
  newTaskName.value = '';
  newTaskDescription.value = '';
  newTodoDueDate.value = ''; // Clear due date input
};

/**
 * Toggles the status of a todo item (pending/completed).
 * @param {number} id - The ID of the todo item to update.
 */
const toggleTodoStatus = (id) => {
  const todo = todos.value.find(t => t.id === id);
  if (todo) {
    todo.status = todo.status === 'completed' ? 'pending' : 'completed';
  }
};

/**
 * Deletes a todo item from the list.
 * @param {number} id - The ID of the todo item to delete.
 */
const deleteTodo = (id) => {
  todos.value = todos.value.filter(t => t.id !== id);
};
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');


.font-inter {
  font-family: 'Inter', sans-serif;
}


html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: transparent; /* Ensure the body is transparent to see the video */
}

/* Video background styles */
.background-video {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100vw;
  min-height: 100vh;
  width: auto;
  height: auto;
  z-index: -1; /* Ensures the video is behind other content */
  object-fit: cover;
  pointer-events: none; /* Allows clicks to pass through the video */
}
</style>
