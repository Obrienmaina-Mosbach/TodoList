<!-- TodoItem.vue -->
<template>
  <li
    :class="[
      'flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg shadow-sm transition-all duration-300 ease-in-out',
      todo.status === 'completed' ? 'bg-emerald-50 border border-emerald-200' : 'bg-white border border-gray-200 hover:shadow-md'
    ]"
  >
    <div class="flex items-start md:items-center flex-grow mb-3 md:mb-0">
      <!-- Checkbox to toggle status -->
      <input
        type="checkbox"
        :checked="todo.status === 'completed'"
        @change="$emit('toggle-done', todo.id)"
        class="form-checkbox h-5 w-5 text-blue-600 rounded-md transition duration-150 ease-in-out cursor-pointer mr-3 mt-1 md:mt-0"
        style="display: block; opacity: 1; visibility: visible;"
      />
      
      <!-- Task Content -->
      <div :class="['flex flex-col flex-grow', { 'line-through text-gray-500': todo.status === 'completed' }]">
        <template v-if="!isEditing">
          <span class="font-semibold text-lg">{{ todo.taskName }}</span>
          <span v-if="todo.taskDescription" class="text-sm text-gray-600 mt-1">{{ todo.taskDescription }}</span>
        </template>
        <template v-else>
          <input
            type="text"
            v-model="editedTaskName"
            class="p-1 border border-gray-300 rounded-md text-lg font-semibold mb-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <input
            type="text"
            v-model="editedTaskDescription"
            placeholder="Description (Optional)"
            class="p-1 border border-gray-300 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </template>

        <span v-if="todo.dueDate" class="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <i class="fas fa-calendar-alt"></i> Due: {{ formatDueDate(todo.dueDate) }}
        </span>
        <span v-if="todo.status === 'completed' && todo.completedAt" class="text-xs text-emerald-500 mt-1 flex items-center gap-1">
          <i class="fas fa-calendar-check"></i> Completed: {{ formatCompletionDate(todo.completedAt) }}
        </span>
      </div>
    </div>

    <!-- Task Actions -->
    <div class="flex items-center gap-3 ml-auto md:ml-0 mt-3 md:mt-0">
      <!-- Status Icon -->
      <i
        :class="[
          'text-xl',
          todo.status === 'completed' ? 'fas fa-check-circle text-emerald-500' : 'fas fa-clock text-yellow-500'
        ]"
      ></i>

      <!-- Edit/Save/Cancel Buttons -->
      <template v-if="!isEditing">
        <button
          @click="startEditing"
          class="px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200 flex items-center gap-2 text-sm"
        >
          <i class="fas fa-edit"></i> Edit
        </button>
      </template>
      <template v-else>
        <button
          @click="saveChanges"
          class="px-3 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-200 flex items-center gap-2 text-sm"
        >
          <i class="fas fa-save"></i> Save
        </button>
        <button
          @click="cancelEditing"
          class="px-3 py-2 bg-gray-400 text-white font-semibold rounded-lg shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75 transition duration-200 flex items-center gap-2 text-sm"
        >
          <i class="fas fa-times"></i> Cancel
        </button>
      </template>

      <!-- Delete Button -->
      <button
        @click="$emit('delete-todo', todo.id)"
        class="px-3 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200 flex items-center gap-2 text-sm"
      >
        <i class="fas fa-trash-alt"></i> Delete
      </button>
    </div>
  </li>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

// Define the props this component expects
const props = defineProps({
  todo: {
    type: Object,
    required: true,
    validator: (value) => {
      // Basic validation for the todo object structure
      return 'id' in value && 'taskName' in value && 'status' in value;
    }
  }
});

// Define the custom events this component can emit
const emit = defineEmits(['toggle-done', 'delete-todo', 'update-todo']); // Added 'update-todo' event

// Reactive state for editing mode
const isEditing = ref(false);
const editedTaskName = ref('');
const editedTaskDescription = ref('');

// Watch for changes in the todo prop to update local editing state
watch(() => props.todo, (newTodo) => {
  editedTaskName.value = newTodo.taskName;
  editedTaskDescription.value = newTodo.taskDescription;
}, { immediate: true }); // immediate: true runs the watcher immediately on component mount

/**
 * Initiates the editing mode.
 */
const startEditing = () => {
  isEditing.value = true;
  // Initialize edited values with current todo values
  editedTaskName.value = props.todo.taskName;
  editedTaskDescription.value = props.todo.taskDescription;
};

/**
 * Saves the changes made during editing and emits an update event.
 */
const saveChanges = () => {
  if (editedTaskName.value.trim() === '') {
    alert('Task name cannot be empty!'); // Basic client-side validation
    return;
  }
  emit('update-todo', {
    id: props.todo.id,
    taskName: editedTaskName.value.trim(),
    taskDescription: editedTaskDescription.value.trim()
  });
  isEditing.value = false; // Exit editing mode
};

/**
 * Cancels editing and reverts to original task details.
 */
const cancelEditing = () => {
  isEditing.value = false;
  // Revert edited values to original todo values
  editedTaskName.value = props.todo.taskName;
  editedTaskDescription.value = props.todo.taskDescription;
};

/**
 * Formats a date string into a more readable format.
 * @param {string} dateString - The date string from datetime-local input.
 * @returns {string} Formatted date string.
 */
const formatDueDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return original if invalid date
  }
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleString(undefined, options);
};

/**
 * Formats a completion date string into a more readable format.
 * @param {string} dateString - The ISO string date of completion.
 * @returns {string} Formatted date string.
 */
const formatCompletionDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString; // Return original if invalid date
  }
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleString(undefined, options);
};
</script>

<style scoped>
/* Scoped styles for TodoItem.vue */
/* Custom checkbox styling if needed, but Tailwind's form-checkbox is good */
.form-checkbox:checked {
  border-color: transparent;
  background-color: #3b82f6; /* Tailwind blue-600 */
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 00-1.414 0L7 8.586 4.207 5.793a1 1 0 00-1.414 1.414l3.5 3.5a1 1 0 001.414 0l5-5a1 1 0 000-1.414z'/%3e%3c/svg%3e");
}
</style>
