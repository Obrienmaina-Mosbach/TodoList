<!-- TodoItem.vue -->
<template>
  <li
    :class="[
      'flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg shadow-sm transition-all duration-300 ease-in-out',
      themeClasses.listItemBg,
      themeClasses.listItemBorder,
      themeClasses.listItemHoverShadow
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
      <div :class="['flex flex-col flex-grow', themeClasses.taskContentText, { 'line-through': todo.status === 'completed' }]">
        <template v-if="!isEditing">
          <span class="font-semibold text-lg">{{ todo.taskName }}</span>
          <span v-if="todo.taskDescription" class="text-sm mt-1">{{ todo.taskDescription }}</span>
        </template>
        <template v-else>
          <input
            type="text"
            v-model="editedTaskName"
            :class="['p-1 border rounded-md text-lg font-semibold mb-1 focus:outline-none focus:ring-1', themeClasses.inputBorder, themeClasses.inputBg, themeClasses.inputText, themeClasses.inputFocusRing]"
          />
          <input
            type="text"
            v-model="editedTaskDescription"
            placeholder="Description (Optional)"
            :class="['p-1 border rounded-md text-sm mt-1 focus:outline-none focus:ring-1', themeClasses.inputBorder, themeClasses.inputBg, themeClasses.inputText, themeClasses.inputFocusRing]"
          />
        </template>

        <span v-if="todo.dueDate" :class="['text-xs mt-1 flex items-center gap-1', themeClasses.dueDateText]">
          <i class="fas fa-calendar-alt"></i> Due: {{ formatDueDate(todo.dueDate) }}
        </span>
        <span v-if="todo.status === 'completed' && todo.completedAt" :class="['text-xs mt-1 flex items-center gap-1', themeClasses.completedAtText]">
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
          todo.status === 'completed' ? themeClasses.completedIcon : themeClasses.pendingIcon
        ]"
      ></i>

      <!-- Edit/Save/Cancel Buttons -->
      <template v-if="!isEditing">
        <button
          @click="startEditing"
          :class="['px-3 py-2 font-semibold rounded-lg shadow-sm transition duration-200 flex items-center gap-2 text-sm', themeClasses.editButtonBg, themeClasses.editButtonText, themeClasses.editButtonHover, themeClasses.editButtonFocus]"
        >
          <i class="fas fa-edit"></i> Edit
        </button>
      </template>
      <template v-else>
        <button
          @click="saveChanges"
          :class="['px-3 py-2 font-semibold rounded-lg shadow-sm transition duration-200 flex items-center gap-2 text-sm', themeClasses.saveButtonBg, themeClasses.saveButtonText, themeClasses.saveButtonHover, themeClasses.saveButtonFocus]"
        >
          <i class="fas fa-save"></i> Save
        </button>
        <button
          @click="cancelEditing"
          :class="['px-3 py-2 font-semibold rounded-lg shadow-sm transition duration-200 flex items-center gap-2 text-sm', themeClasses.cancelButtonBg, themeClasses.cancelButtonText, themeClasses.cancelButtonHover, themeClasses.cancelButtonFocus]"
        >
          <i class="fas fa-times"></i> Cancel
        </button>
      </template>

      <!-- Delete Button -->
      <button
        @click="$emit('delete-todo', todo.id)"
        :class="['px-3 py-2 font-semibold rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200 flex items-center gap-2 text-sm', themeClasses.deleteButtonBg, themeClasses.deleteButtonText, themeClasses.deleteButtonHover, themeClasses.deleteButtonFocus]"
      >
        <i class="fas fa-trash-alt"></i> Delete
      </button>
    </div>
  </li>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed } from 'vue'; // Added 'computed'

// Define the props this component expects
const props = defineProps({
  todo: {
    type: Object,
    required: true,
    validator: (value) => {
      // Basic validation for the todo object structure
      return 'id' in value && 'taskName' in value && 'status' in value;
    }
  },
  currentTheme: { // Added currentTheme prop
    type: String,
    required: true
  }
});

// Define the custom events this component can emit
const emit = defineEmits(['toggle-done', 'delete-todo', 'update-todo']);

// Reactive state for editing mode
const isEditing = ref(false);
const editedTaskName = ref('');
const editedTaskDescription = ref('');

// Watch for changes in the todo prop to update local editing state
watch(() => props.todo, (newTodo) => {
  editedTaskName.value = newTodo.taskName;
  editedTaskDescription.value = newTodo.taskDescription;
}, { immediate: true });

// Computed property to define theme-specific classes for TodoItem
const themeClasses = computed(() => {
  if (props.currentTheme === 'dark') {
    return {
      listItemBg: props.todo.status === 'completed' ? 'bg-emerald-900' : 'bg-gray-700',
      listItemBorder: props.todo.status === 'completed' ? 'border-emerald-700' : 'border-gray-600',
      listItemHoverShadow: 'hover:shadow-lg', // Darker shadow for dark mode
      taskContentText: 'text-gray-100',
      dueDateText: 'text-gray-400',
      completedAtText: 'text-emerald-400',
      completedIcon: 'fas fa-check-circle text-emerald-400',
      pendingIcon: 'fas fa-clock text-yellow-400',
      editButtonBg: 'bg-blue-700',
      editButtonText: 'text-white',
      editButtonHover: 'hover:bg-blue-800',
      editButtonFocus: 'focus:ring-blue-600',
      saveButtonBg: 'bg-green-700',
      saveButtonText: 'text-white',
      saveButtonHover: 'hover:bg-green-800',
      saveButtonFocus: 'focus:ring-green-600',
      cancelButtonBg: 'bg-gray-500',
      cancelButtonText: 'text-white',
      cancelButtonHover: 'hover:bg-gray-600',
      cancelButtonFocus: 'focus:ring-gray-400',
      deleteButtonBg: 'bg-red-700',
      deleteButtonText: 'text-white',
      deleteButtonHover: 'hover:bg-red-800',
      deleteButtonFocus: 'focus:ring-red-600',
      inputBorder: 'border-gray-500',
      inputBg: 'bg-gray-600',
      inputText: 'text-gray-100',
      inputFocusRing: 'focus:ring-blue-300'
    };
  } else { // Light theme
    return {
      listItemBg: props.todo.status === 'completed' ? 'bg-emerald-50' : 'bg-white',
      listItemBorder: props.todo.status === 'completed' ? 'border-emerald-200' : 'border-gray-200',
      listItemHoverShadow: 'hover:shadow-md',
      taskContentText: 'text-gray-800',
      dueDateText: 'text-gray-500',
      completedAtText: 'text-emerald-600',
      completedIcon: 'fas fa-check-circle text-emerald-500',
      pendingIcon: 'fas fa-clock text-yellow-500',
      editButtonBg: 'bg-blue-500',
      editButtonText: 'text-white',
      editButtonHover: 'hover:bg-blue-600',
      editButtonFocus: 'focus:ring-blue-400',
      saveButtonBg: 'bg-green-500',
      saveButtonText: 'text-white',
      saveButtonHover: 'hover:bg-green-600',
      saveButtonFocus: 'focus:ring-green-400',
      cancelButtonBg: 'bg-gray-400',
      cancelButtonText: 'text-white',
      cancelButtonHover: 'hover:bg-gray-500',
      cancelButtonFocus: 'focus:ring-gray-300',
      deleteButtonBg: 'bg-red-500',
      deleteButtonText: 'text-white',
      deleteButtonHover: 'hover:bg-red-600',
      deleteButtonFocus: 'focus:ring-red-400',
      inputBorder: 'border-gray-300',
      inputBg: 'bg-white',
      inputText: 'text-gray-800',
      inputFocusRing: 'focus:ring-blue-400'
    };
  }
});

/**
 * Initiates the editing mode.
 */
const startEditing = () => {
  isEditing.value = true;
  editedTaskName.value = props.todo.taskName;
  editedTaskDescription.value = props.todo.taskDescription;
};

/**
 * Saves the changes made during editing and emits an update event.
 */
const saveChanges = () => {
  if (editedTaskName.value.trim() === '') {
    alert('Task name cannot be empty!');
    return;
  }
  emit('update-todo', {
    id: props.todo.id,
    taskName: editedTaskName.value.trim(),
    taskDescription: editedTaskDescription.value.trim()
  });
  isEditing.value = false;
};

/**
 * Cancels editing and reverts to original task details.
 */
const cancelEditing = () => {
  isEditing.value = false;
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
  if (isNaN(date.getTime())) {
    return dateString;
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
    return dateString;
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
