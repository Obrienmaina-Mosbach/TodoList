<!-- App.vue -->
<template>
  <div :class="['min-h-screen flex flex-col items-center py-10 font-inter', themeClasses.bodyBg, themeClasses.bodyText]">
    <!-- Background Video -->
    <video autoplay loop muted playsinline class="background-video">
      <source src="./assets/2235282-hd_1278_720_30fps.mp4" type="video/mp4">
      <!-- Fallback for browsers that do not support the video tag -->
      Your browser does not support the video tag.
    </video>

    <div :class="['container rounded-xl shadow-xl p-8 md:p-12 max-w-2xl w-full relative z-10', themeClasses.containerBg]">
      <!-- Header Section -->
      <header class="text-center mb-10 flex justify-between items-center flex-wrap gap-4">
        <h1 :class="['text-4xl font-bold flex items-center justify-center gap-4', themeClasses.headerText]">
          <i :class="['fas fa-clipboard-list', themeClasses.headerIcon]"></i>
          O'brien'S To-Do List
        </h1>
        <!-- Theme Selector -->
        <div class="flex items-center gap-3">
          <label for="theme-select" :class="['text-sm font-medium', themeClasses.themeLabelText]">Theme:</label>
          <select
            id="theme-select"
            v-model="currentTheme"
            :class="['px-3 py-2 rounded-lg border shadow-sm focus:outline-none focus:ring-2 transition duration-200 text-sm', themeClasses.themeSelectBg, themeClasses.themeSelectText, themeClasses.themeSelectBorder, themeClasses.themeSelectFocusRing]"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
          </select>
        </div>
      </header>

      <!-- Add New Task Section -->
      <section class="mb-8 pb-6 border-b" :class="themeClasses.borderColor">
        <h2 :class="['text-2xl font-semibold mb-6 flex items-center gap-3', themeClasses.sectionHeaderText]">
          <i :class="['fas fa-plus-circle', themeClasses.sectionIconColor]"></i>
          Add New Task
        </h2>
        <form @submit.prevent="addTodo" class="flex flex-col md:flex-row gap-4 flex-wrap">
          <input
            type="text"
            v-model="newTaskName"
            placeholder="Task Title"
            required
            :class="['flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 min-w-[150px]', themeClasses.inputBorder, themeClasses.inputBg, themeClasses.inputText, themeClasses.inputFocusRing]"
          />
          <input
            type="text"
            v-model="newTaskDescription"
            placeholder="Task Description (Optional)"
            :class="['flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 min-w-[150px]', themeClasses.inputBorder, themeClasses.inputBg, themeClasses.inputText, themeClasses.inputFocusRing]"
          />
          <input
            type="datetime-local"
            v-model="newTodoDueDate"
            :class="['flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 min-w-[200px]', themeClasses.inputBorder, themeClasses.inputBg, themeClasses.inputText, themeClasses.inputFocusRing]"
          />
          <select
            v-model="newTodoPriority"
            :class="['flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 min-w-[150px]', themeClasses.inputBorder, themeClasses.inputBg, themeClasses.inputText, themeClasses.inputFocusRing]"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          <button
            type="submit"
            :class="['px-6 py-3 font-semibold rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2 w-full md:w-auto', themeClasses.primaryButtonBg, themeClasses.primaryButtonText, themeClasses.primaryButtonHover, themeClasses.primaryButtonFocus]"
          >
            <i class="fas fa-plus"></i>
            Add Task
          </button>
        </form>
      </section>

      <!-- Task Management Controls (Search, Filter, Sort, Clear Completed) -->
      <section class="mb-8 pb-6 border-b" :class="themeClasses.borderColor">
        <h2 :class="['text-2xl font-semibold mb-6 flex items-center gap-3', themeClasses.sectionHeaderText]">
          <i :class="['fas fa-filter', themeClasses.filterIconColor]"></i>
          Manage Tasks
        </h2>
        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <!-- Search Input -->
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search tasks..."
            :class="['flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200', themeClasses.inputBorder, themeClasses.inputBg, themeClasses.inputText, themeClasses.inputFocusRing]"
          />

          <!-- Filter by Status -->
          <select
            v-model="filterStatus"
            :class="['p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 md:w-auto w-full', themeClasses.inputBorder, themeClasses.inputBg, themeClasses.inputText, themeClasses.inputFocusRing]"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <!-- Sort By -->
          <select
            v-model="sortCriteria"
            :class="['p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 md:w-auto w-full', themeClasses.inputBorder, themeClasses.inputBg, themeClasses.inputText, themeClasses.inputFocusRing]"
          >
            <option value="createdAt">Sort by Creation Date</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="taskName">Sort by Task Name</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
        <!-- Clear Completed Button -->
        <button
          @click="clearCompletedTodos"
          v-if="todos.some(todo => todo.status === 'completed')"
          :class="['px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200 flex items-center justify-center gap-2 w-full md:w-auto']"
        >
          <i class="fas fa-trash-alt"></i> Clear Completed Tasks
        </button>
      </section>

      <!-- Current Tasks Section -->
      <section>
        <h2 :class="['text-2xl font-semibold mb-6 flex items-center gap-3', themeClasses.sectionHeaderText]">
          <i :class="['fas fa-tasks', themeClasses.tasksIconColor]"></i>
          Current Tasks
        </h2>
        <ul class="space-y-4">
          <li v-if="displayedTodos.length === 0" :class="['text-center italic p-6 rounded-lg border', themeClasses.noTasksMessageBg, themeClasses.noTasksMessageBorder, themeClasses.noTasksMessageText]">
            No tasks match your criteria.
          </li>
          <TodoItem
            v-for="todo in displayedTodos"
            :key="todo._id"
            :todo="todo"
            @toggle-done="toggleTodoStatus"
            @delete-todo="deleteTodo"
            @update-todo="updateTodoDetails"
            @update-priority="updateTodoPriority"
            :currentTheme="currentTheme"
          />
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import TodoItem from './components/TodoItem.vue';
import axios from 'axios';

// --- API Base URL ---
// Use environment variable for API_BASE_URL
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

// --- Reactive State for Todos and Inputs ---
const todos = ref([]);
const newTaskName = ref('');
const newTaskDescription = ref('');
const newTodoDueDate = ref('');
const newTodoPriority = ref('Medium');

// --- Reactive State for Filtering, Sorting, and Searching ---
const filterStatus = ref('all');
const sortCriteria = ref('createdAt');
const searchTerm = ref('');

// --- Theme Management ---
const currentTheme = ref('light');

// Load theme from localStorage on mount
onMounted(() => {
  const storedTheme = localStorage.getItem('vue-todo-list-theme');
  if (storedTheme) {
    currentTheme.value = storedTheme;
  }
});

// Watch for theme changes and save to localStorage
watch(currentTheme, (newTheme) => {
  localStorage.setItem('vue-todo-list-theme', newTheme);
});

// Computed property to define theme-specific classes
const themeClasses = computed(() => {
  const themes = {
    light: {
      bodyBg: 'bg-gray-100',
      bodyText: 'text-gray-800',
      containerBg: 'bg-white',
      headerText: 'text-emerald-600',
      headerIcon: 'text-blue-500',
      themeSelectBg: 'bg-white',
      themeSelectText: 'text-gray-800',
      themeSelectBorder: 'border-gray-300',
      themeSelectFocusRing: 'focus:ring-blue-400',
      sectionHeaderText: 'text-gray-700',
      sectionIconColor: 'text-yellow-500',
      filterIconColor: 'text-purple-500',
      tasksIconColor: 'text-orange-500',
      inputBorder: 'border-gray-300',
      inputBg: 'bg-white',
      inputText: 'text-gray-800',
      inputFocusRing: 'focus:ring-blue-400',
      primaryButtonBg: 'bg-emerald-500',
      primaryButtonText: 'text-black',
      primaryButtonHover: 'hover:bg-emerald-600',
      primaryButtonFocus: 'focus:ring-emerald-400',
      borderColor: 'border-gray-200',
      noTasksMessageBg: 'bg-yellow-50',
      noTasksMessageBorder: 'border-yellow-200',
      noTasksMessageText: 'text-gray-500'
    },
    dark: {
      bodyBg: 'bg-gray-900',
      bodyText: 'text-gray-100',
      containerBg: 'bg-gray-800',
      headerText: 'text-teal-400',
      headerIcon: 'text-blue-400',
      themeSelectBg: 'bg-gray-700',
      themeSelectText: 'text-gray-100',
      themeSelectBorder: 'border-gray-600',
      themeSelectFocusRing: 'focus:ring-blue-300',
      sectionHeaderText: 'text-gray-200',
      sectionIconColor: 'text-yellow-300',
      filterIconColor: 'text-purple-300',
      tasksIconColor: 'text-orange-300',
      inputBorder: 'border-gray-600',
      inputBg: 'bg-gray-700',
      inputText: 'text-gray-100',
      inputFocusRing: 'focus:ring-blue-300',
      primaryButtonBg: 'bg-emerald-600',
      primaryButtonText: 'text-white',
      primaryButtonHover: 'hover:bg-emerald-700',
      primaryButtonFocus: 'focus:ring-emerald-500',
      borderColor: 'border-gray-700',
      noTasksMessageBg: 'bg-gray-700',
      noTasksMessageBorder: 'border-gray-600',
      noTasksMessageText: 'text-gray-400'
    },
    blue: {
      bodyBg: 'bg-blue-100',
      bodyText: 'text-blue-900',
      containerBg: 'bg-white',
      headerText: 'text-blue-700',
      headerIcon: 'text-indigo-600',
      themeSelectBg: 'bg-white',
      themeSelectText: 'text-blue-900',
      themeSelectBorder: 'border-blue-300',
      themeSelectFocusRing: 'focus:ring-blue-500',
      sectionHeaderText: 'text-blue-600',
      sectionIconColor: 'text-cyan-500',
      filterIconColor: 'text-purple-600',
      tasksIconColor: 'text-orange-600',
      inputBorder: 'border-blue-300',
      inputBg: 'bg-white',
      inputText: 'text-blue-900',
      inputFocusRing: 'focus:ring-blue-500',
      primaryButtonBg: 'bg-blue-500',
      primaryButtonText: 'text-white',
      primaryButtonHover: 'hover:bg-blue-600',
      primaryButtonFocus: 'focus:ring-blue-400',
      borderColor: 'border-blue-200',
      noTasksMessageBg: 'bg-blue-50',
      noTasksMessageBorder: 'border-blue-200',
      noTasksMessageText: 'text-blue-600'
    },
    green: {
      bodyBg: 'bg-green-100',
      bodyText: 'text-green-900',
      containerBg: 'bg-white',
      headerText: 'text-green-700',
      headerIcon: 'text-emerald-600',
      themeSelectBg: 'bg-white',
      themeSelectText: 'text-green-900',
      themeSelectBorder: 'border-green-300',
      themeSelectFocusRing: 'focus:ring-green-500',
      sectionHeaderText: 'text-green-600',
      sectionIconColor: 'text-lime-500',
      filterIconColor: 'text-teal-600',
      tasksIconColor: 'text-yellow-600',
      inputBorder: 'border-green-300',
      inputBg: 'bg-white',
      inputText: 'text-green-900',
      inputFocusRing: 'focus:ring-green-500',
      primaryButtonBg: 'bg-green-500',
      primaryButtonText: 'text-white',
      primaryButtonHover: 'hover:bg-green-600',
      primaryButtonFocus: 'focus:ring-green-400',
      borderColor: 'border-green-200',
      noTasksMessageBg: 'bg-green-50',
      noTasksMessageBorder: 'border-green-200',
      noTasksMessageText: 'text-green-600'
    }
  };
  return themes[currentTheme.value] || themes.light; // Fallback to light if theme not found
});

// --- Notifications/Reminders ---
const remindedTaskIds = ref(new Set());
let reminderInterval = null;

// Function to fetch todos from the backend
const fetchTodos = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    todos.value = response.data;
    console.log('Todos fetched from backend:', todos.value);
  } catch (error) {
    console.error('Error fetching todos:', error);
    alert('Failed to load tasks. Please check the server connection.');
  }
};

onMounted(() => {
  fetchTodos(); // Fetch todos on component mount
  reminderInterval = setInterval(checkReminders, 60000); // Check reminders every minute
});

onUnmounted(() => {
  if (reminderInterval) {
    clearInterval(reminderInterval);
  }
});

const checkReminders = () => {
  const now = new Date();
  todos.value.forEach(todo => {
    // MongoDB stores _id, not id
    if (todo.dueDate && todo.status === 'pending' && !remindedTaskIds.value.has(todo._id)) {
      const dueDate = new Date(todo.dueDate);
      const timeDiff = dueDate.getTime() - now.getTime();

      const fifteenMinutes = 15 * 60 * 1000;

      if (timeDiff <= fifteenMinutes && timeDiff > -86400000) {
        alert(`Reminder: Task "${todo.taskName}" is due soon or overdue!\nDue: ${formatDateForReminder(dueDate)}`);
        remindedTaskIds.value.add(todo._id);
      }
    }
  });
};

const formatDateForReminder = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString(undefined, options);
};

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
  const currentTodos = [...searchedAndFilteredTodos.value];

  currentTodos.sort((a, b) => {
    if (sortCriteria.value === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortCriteria.value === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortCriteria.value === 'taskName') {
      return a.taskName.localeCompare(b.taskName);
    } else if (sortCriteria.value === 'priority') {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });
  return currentTodos;
});

// --- Methods for API Interaction ---

/**
 * Adds a new todo item to the list via API.
 */
const addTodo = async () => {
  if (newTaskName.value.trim() === '') {
    alert('Task title cannot be empty!');
    return;
  }

  const newTodoData = {
    taskName: newTaskName.value.trim(),
    taskDescription: newTaskDescription.value.trim(),
    dueDate: newTodoDueDate.value || null,
    priority: newTodoPriority.value,
    status: 'pending',
    createdAt: new Date().toISOString(), // Ensure createdAt is sent
  };

  try {
    const response = await axios.post(API_BASE_URL, newTodoData);
    todos.value.unshift(response.data); // Add the new todo received from the backend
    // Clear inputs
    newTaskName.value = '';
    newTaskDescription.value = '';
    newTodoDueDate.value = '';
    newTodoPriority.value = 'Medium';
  } catch (error) {
    console.error('Error adding todo:', error);
    alert('Failed to add task.');
  }
};

/**
 * Toggles the status of a todo item via API.
 * @param {string} id - The _id of the todo item to update (from MongoDB).
 */
const toggleTodoStatus = async (id) => {
  const todoIndex = todos.value.findIndex(t => t._id === id);
  if (todoIndex === -1) return;

  const todo = todos.value[todoIndex];
  const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
  const newCompletedAt = newStatus === 'completed' ? new Date().toISOString() : null;

  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, {
      status: newStatus,
      completedAt: newCompletedAt, // Send completedAt to backend
    });
    // Update the local todo object with data from the backend response
    todos.value[todoIndex] = response.data;
    if (newStatus === 'pending') {
      remindedTaskIds.value.delete(id); // Allow reminder again if marked undone
    }
  } catch (error) {
    console.error('Error toggling todo status:', error);
    alert('Failed to update task status.');
  }
};

/**
 * Deletes a todo item via API.
 * @param {string} id - The _id of the todo item to delete (from MongoDB).
 */
const deleteTodo = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
    todos.value = todos.value.filter(t => t._id !== id);
    remindedTaskIds.value.delete(id); // Remove from reminded set if deleted
  } catch (error) {
    console.error('Error deleting todo:', error);
    alert('Failed to delete task.');
  }
};

/**
 * Clears all completed todo items via API.
 */
const clearCompletedTodos = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/completed`);
    todos.value = todos.value.filter(todo => todo.status !== 'completed');
    // Clear relevant IDs from remindedTaskIds
    remindedTaskIds.value = new Set([...remindedTaskIds.value].filter(id => todos.value.some(todo => todo._id === id)));
  } catch (error) {
    console.error('Error clearing completed todos:', error);
    alert('Failed to clear completed tasks.');
  }
};

/**
 * Updates the details (name and description) of an existing todo item via API.
 * @param {Object} updatedTodo - Object containing _id, new taskName, and new taskDescription.
 */
const updateTodoDetails = async (updatedTodo) => {
  const todoIndex = todos.value.findIndex(t => t._id === updatedTodo.id); // Use updatedTodo.id to match _id
  if (todoIndex === -1) return;

  try {
    const response = await axios.put(`${API_BASE_URL}/${updatedTodo.id}`, {
      taskName: updatedTodo.taskName,
      taskDescription: updatedTodo.taskDescription
    });
    todos.value[todoIndex] = response.data; // Update local todo with response data
  } catch (error) {
    console.error('Error updating todo details:', error);
    alert('Failed to update task details.');
  }
};

/**
 * Updates the priority of an existing todo item via API.
 * @param {Object} payload - Object containing id (MongoDB _id) and newPriority.
 */
const updateTodoPriority = async (payload) => {
  const todoIndex = todos.value.findIndex(t => t._id === payload.id);
  if (todoIndex === -1) return;

  try {
    const response = await axios.put(`${API_BASE_URL}/${payload.id}`, {
      priority: payload.newPriority
    });
    todos.value[todoIndex] = response.data; // Update local todo with response data
  } catch (error) {
    console.error('Error updating todo priority:', error);
    alert('Failed to update task priority.');
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
  background-color: transparent;
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
  z-index: -1;
  object-fit: cover;
  pointer-events: none;
}
</style>
