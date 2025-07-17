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
            class="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 transition duration-200 flex items-center justify-center gap-2 w-full md:w-auto"
          >
            <i class="fas fa-plus"></i>
            Add Task
          </button>
        </form>
      </section>

      <!-- Task Management Controls (Search, Filter, Sort) -->
      <section class="mb-8 pb-6 border-b border-gray-200">
        <h2 class="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3">
          <i class="fas fa-filter text-purple-500"></i>
          Manage Tasks
        </h2>
        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <!-- Search Input -->
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search tasks..."
            class="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200"
          />

          <!-- Filter by Status -->
          <select
            v-model="filterStatus"
            class="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200 md:w-auto w-full"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <!-- Sort By -->
          <select
            v-model="sortCriteria"
            class="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200 md:w-auto w-full"
          >
            <option value="createdAt">Sort by Creation Date</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="taskName">Sort by Task Name</option>
          </select>
        </div>
      </section>

      <!-- Current Tasks Section -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3">
          <i class="fas fa-tasks text-orange-500"></i>
          Current Tasks
        </h2>
        <ul class="space-y-4">
          <li v-if="displayedTodos.length === 0" class="text-center text-gray-500 italic p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            No tasks match your criteria.
          </li>
          <TodoItem
            v-for="todo in displayedTodos"
            :key="todo.id"
            :todo="todo"
            @toggle-done="toggleTodoStatus"
            @delete-todo="deleteTodo"
            @update-todo="updateTodoDetails"
          />
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import TodoItem from './components/TodoItem.vue';

// --- Reactive State for Todos and Inputs ---
const todos = ref([]); // Initialize as empty, will load from localStorage
const newTaskName = ref('');
const newTaskDescription = ref('');
const newTodoDueDate = ref('');
let nextId = 1; // Start ID from 1, or from max existing ID + 1 after loading

// --- Reactive State for Filtering, Sorting, and Searching ---
const filterStatus = ref('all'); // 'all', 'pending', 'completed'
const sortCriteria = ref('createdAt'); // 'createdAt', 'dueDate', 'taskName'
const searchTerm = ref('');

// --- Local Storage Persistence ---
onMounted(() => {
  try {
    const storedTodos = localStorage.getItem('vue-todo-list-todos');
    if (storedTodos) {
      todos.value = JSON.parse(storedTodos);
      // Ensure nextId is higher than any existing ID
      if (todos.value.length > 0) {
        nextId = Math.max(...todos.value.map(t => t.id)) + 1;
      }
    } else {
      // If no stored todos, initialize with default ones
      todos.value = [
        { id: nextId++, taskName: 'Learn Vue 3 Basics', taskDescription: 'Understand components, props, and events.', status: 'pending', dueDate: null, createdAt: new Date().toISOString(), completedAt: null },
        { id: nextId++, taskName: 'Build a To-Do App', taskDescription: 'Apply learned concepts to a practical project.', status: 'completed', dueDate: new Date('2025-07-20T10:00').toISOString().slice(0, 16), createdAt: new Date(Date.now() - 86400000).toISOString(), completedAt: new Date('2025-07-17T14:00:00Z').toISOString() },
        { id: nextId++, taskName: 'Explore Vue Router', taskDescription: 'Learn how to navigate between different views.', status: 'pending', dueDate: new Date('2025-07-25T14:30').toISOString().slice(0, 16), createdAt: new Date(Date.now() - 172800000).toISOString(), completedAt: null }
      ];
    }
  } catch (e) {
    console.error("Error loading todos from localStorage:", e);
    // Fallback to default if there's an error parsing stored data
    todos.value = [
        { id: nextId++, taskName: 'Learn Vue 3 Basics', taskDescription: 'Understand components, props, and events.', status: 'pending', dueDate: null, createdAt: new Date().toISOString(), completedAt: null },
        { id: nextId++, taskName: 'Build a To-Do App', taskDescription: 'Apply learned concepts to a practical project.', status: 'completed', dueDate: new Date('2025-07-20T10:00').toISOString().slice(0, 16), createdAt: new Date(Date.now() - 86400000).toISOString(), completedAt: new Date('2025-07-17T14:00:00Z').toISOString() },
        { id: nextId++, taskName: 'Explore Vue Router', taskDescription: 'Learn how to navigate between different views.', status: 'pending', dueDate: new Date('2025-07-25T14:30').toISOString().slice(0, 16), createdAt: new Date(Date.now() - 172800000).toISOString(), completedAt: null }
      ];
  }
});

// Watch for changes in the todos array and save to localStorage
watch(todos, (newTodos) => {
  localStorage.setItem('vue-todo-list-todos', JSON.stringify(newTodos));
}, { deep: true }); // deep: true is important for watching changes inside objects within the array

// --- Computed Properties for Filtering, Searching, and Sorting ---

const filteredTodosByStatus = computed(() => {
  if (filterStatus.value === 'all') {
    return todos.value;
  }
  return todos.value.filter(todo => todo.status === filterStatus.value);
});

const searchedAndFilteredTodos = computed(() => {
  const currentTodos = filteredTodosByStatus.value;
  if (!searchTerm.value) {
    return currentTodos;
  }
  const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
  return currentTodos.filter(todo =>
    todo.taskName.toLowerCase().includes(lowerCaseSearchTerm) ||
    (todo.taskDescription && todo.taskDescription.toLowerCase().includes(lowerCaseSearchTerm))
  );
});

const displayedTodos = computed(() => {
  const currentTodos = [...searchedAndFilteredTodos.value]; // Create a shallow copy to avoid mutating original array during sort

  currentTodos.sort((a, b) => {
    if (sortCriteria.value === 'createdAt') {
      // Sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortCriteria.value === 'dueDate') {
      // Sort by due date (tasks with no due date go to the end)
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortCriteria.value === 'taskName') {
      // Sort alphabetically by task name
      return a.taskName.localeCompare(b.taskName);
    }
    return 0;
  });
  return currentTodos;
});


// --- Methods ---

/**
 * Adds a new todo item to the list.
 */
const addTodo = () => {
  if (newTaskName.value.trim() === '') {
    // Basic client-side validation
    alert('Task title cannot be empty!');
    return;
  }

  const newTodo = {
    id: nextId++,
    taskName: newTaskName.value.trim(),
    taskDescription: newTaskDescription.value.trim(),
    dueDate: newTodoDueDate.value || null,
    status: 'pending',
    createdAt: new Date().toISOString(), // Add creation timestamp
    completedAt: null
  };

  todos.value.unshift(newTodo); // Add to the beginning

  // Clear inputs
  newTaskName.value = '';
  newTaskDescription.value = '';
  newTodoDueDate.value = '';
};

/**
 * Toggles the status of a todo item (pending/completed).
 * @param {number} id - The ID of the todo item to update.
 */
const toggleTodoStatus = (id) => {
  const todo = todos.value.find(t => t.id === id);
  if (todo) {
    if (todo.status === 'completed') {
      todo.status = 'pending';
      todo.completedAt = null; // Clear completedAt if marked undone
    } else {
      todo.status = 'completed';
      todo.completedAt = new Date().toISOString(); // Set current time if marked done
    }
  }
};

/**
 * Deletes a todo item from the list.
 * @param {number} id - The ID of the todo item to delete.
 */
const deleteTodo = (id) => {
  todos.value = todos.value.filter(t => t.id !== id);
};

/**
 * Updates the details (name and description) of an existing todo item.
 * @param {Object} updatedTodo - Object containing id, new taskName, and new taskDescription.
 */
const updateTodoDetails = (updatedTodo) => {
  const index = todos.value.findIndex(t => t.id === updatedTodo.id);
  if (index !== -1) {
    todos.value[index].taskName = updatedTodo.taskName;
    todos.value[index].taskDescription = updatedTodo.taskDescription;
  }
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
