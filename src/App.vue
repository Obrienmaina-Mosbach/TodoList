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
          O'brien's To-Do List
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
            :key="todo.id"
            :todo="todo"
            @toggle-done="toggleTodoStatus"
            @delete-todo="deleteTodo"
            @update-todo="updateTodoDetails"
            :currentTheme="currentTheme"
          />
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'; // Added onUnmounted
import TodoItem from './components/TodoItem.vue';

// --- Reactive State for Todos and Inputs ---
const todos = ref([]); // Initialize as empty, will load from localStorage
const newTaskName = ref('');
const newTaskDescription = ref('');
const newTodoDueDate = ref('');
const newTodoPriority = ref('Medium'); // New ref for priority, default to Medium
let nextId = 1; // Start ID from 1, or from max existing ID + 1 after loading

// --- Reactive State for Filtering, Sorting, and Searching ---
const filterStatus = ref('all'); // 'all', 'pending', 'completed'
const sortCriteria = ref('createdAt'); // 'createdAt', 'dueDate', 'taskName', 'priority'
const searchTerm = ref('');

// --- Theme Management ---
const currentTheme = ref('light'); // Default theme

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
      primaryButtonText: 'text-black', // Changed to text-black for visibility
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

// --- Local Storage Persistence for Todos ---
onMounted(() => {
  try {
    const storedTodos = localStorage.getItem('vue-todo-list-todos');
    if (storedTodos) {
      todos.value = JSON.parse(storedTodos);
      if (todos.value.length > 0) {
        nextId = Math.max(...todos.value.map(t => t.id)) + 1;
      }
    } else {
      todos.value = [
        { id: nextId++, taskName: 'Learn Vue 3 Basics', taskDescription: 'Understand components, props, and events.', status: 'pending', dueDate: null, priority: 'Medium', createdAt: new Date().toISOString(), completedAt: null },
        { id: nextId++, taskName: 'Build a To-Do App', taskDescription: 'Apply learned concepts to a practical project.', status: 'completed', dueDate: new Date('2025-07-20T10:00').toISOString().slice(0, 16), priority: 'High', createdAt: new Date(Date.now() - 86400000).toISOString(), completedAt: new Date('2025-07-17T14:00:00Z').toISOString() },
        { id: nextId++, taskName: 'Explore Vue Router', taskDescription: 'Learn how to navigate between different views.', status: 'pending', dueDate: new Date('2025-07-25T14:30').toISOString().slice(0, 16), priority: 'Low', createdAt: new Date(Date.now() - 172800000).toISOString(), completedAt: null }
      ];
    }
  } catch (e) {
    console.error("Error loading todos from localStorage:", e);
    todos.value = [
        { id: nextId++, taskName: 'Learn Vue 3 Basics', taskDescription: 'Understand components, props, and events.', status: 'pending', dueDate: null, priority: 'Medium', createdAt: new Date().toISOString(), completedAt: null },
        { id: nextId++, taskName: 'Build a To-Do App', taskName: 'Apply learned concepts to a practical project.', status: 'completed', dueDate: new Date('2025-07-20T10:00').toISOString().slice(0, 16), createdAt: new Date(Date.now() - 86400000).toISOString(), completedAt: new Date('2025-07-17T14:00:00Z').toISOString() },
        { id: nextId++, taskName: 'Explore Vue Router', taskDescription: 'Learn how to navigate between different views.', status: 'pending', dueDate: new Date('2025-07-25T14:30').toISOString().slice(0, 16), createdAt: new Date(Date.now() - 172800000).toISOString(), completedAt: null }
      ];
  }
});

// Watch for changes in the todos array and save to localStorage
watch(todos, (newTodos) => {
  localStorage.setItem('vue-todo-list-todos', JSON.stringify(newTodos));
}, { deep: true });

// --- Notifications/Reminders ---
const remindedTaskIds = ref(new Set()); // To store IDs of tasks for which reminders have been shown
let reminderInterval = null;

onMounted(() => {
  // Set up reminder check every minute (60,000 ms)
  reminderInterval = setInterval(checkReminders, 60000);
});

onUnmounted(() => {
  // Clear the interval when the component is unmounted to prevent memory leaks
  if (reminderInterval) {
    clearInterval(reminderInterval);
  }
});

const checkReminders = () => {
  const now = new Date();
  todos.value.forEach(todo => {
    if (todo.dueDate && todo.status === 'pending' && !remindedTaskIds.value.has(todo.id)) {
      const dueDate = new Date(todo.dueDate);
      const timeDiff = dueDate.getTime() - now.getTime(); // Difference in milliseconds

      // Remind 15 minutes before or if overdue
      const fifteenMinutes = 15 * 60 * 1000;

      if (timeDiff <= fifteenMinutes && timeDiff > -86400000) { // Remind up to 24 hours after due
        alert(`Reminder: Task "${todo.taskName}" is due soon or overdue!\nDue: ${formatDateForReminder(dueDate)}`);
        remindedTaskIds.value.add(todo.id); // Mark as reminded
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
      // Handle null due dates by pushing them to the end
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1; // a has no due date, b does, so a comes after b
      if (!b.dueDate) return -1; // b has no due date, a does, so b comes after a
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortCriteria.value === 'taskName') {
      return a.taskName.localeCompare(b.taskName);
    } else if (sortCriteria.value === 'priority') {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority]; // High to Low
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
    alert('Task title cannot be empty!');
    return;
  }

  const newTodo = {
    id: nextId++,
    taskName: newTaskName.value.trim(),
    taskDescription: newTaskDescription.value.trim(),
    dueDate: newTodoDueDate.value || null,
    priority: newTodoPriority.value, // Add priority
    status: 'pending',
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  todos.value.unshift(newTodo); // Add to the beginning

  // Clear inputs
  newTaskName.value = '';
  newTaskDescription.value = '';
  newTodoDueDate.value = '';
  newTodoPriority.value = 'Medium'; // Reset priority to default
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
      remindedTaskIds.value.delete(todo.id); // Allow reminder again if marked undone
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
  remindedTaskIds.value.delete(id); // Remove from reminded set if deleted
};

/**
 * Clears all completed todo items from the list.
 */
const clearCompletedTodos = () => {
  todos.value = todos.value.filter(todo => todo.status !== 'completed');
  // Also clear from remindedTaskIds if they were completed and then cleared
  remindedTaskIds.value = new Set([...remindedTaskIds.value].filter(id => todos.value.some(todo => todo.id === id)));
};

/**
 * Updates the details (name and description) of an existing todo item.
 * @param {Object} updatedTodo - Object containing id, new taskName, and new taskDescription.
 */
const updateTodoDetails = (updatedTodo) => {
  const index = todos.value.findIndex(t => t.id === updatedTodo.id);
  if (index !== -1) {
    // Update only the name and description, preserve other properties
    todos.value[index].taskName = updatedTodo.taskName;
    todos.value[index].taskDescription = updatedTodo.taskDescription;
    // Note: Priority and DueDate are not updated via this method from TodoItem.vue yet
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
