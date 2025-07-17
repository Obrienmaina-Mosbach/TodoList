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
        @change="$emit('toggle-done', todo._id)"
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
        <!-- Priority Display and Editor -->
        <div class="flex items-center gap-2 mt-1">
          <span :class="['text-xs font-semibold px-2 py-1 rounded-full', themeClasses.priorityBadgeBg(todo.priority), themeClasses.priorityBadgeText]">
            {{ todo.priority }} Priority
          </span>
          <select
            v-if="isEditing"
            v-model="editedTodoPriority"
            @change="$emit('update-priority', { id: todo._id, newPriority: editedTodoPriority })"
            :class="['p-1 border rounded-md text-xs focus:outline-none focus:ring-1', themeClasses.inputBorder, themeClasses.inputBg, themeClasses.inputText, themeClasses.inputFocusRing]"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
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
        @click="$emit('delete-todo', todo._id)"
        :class="['px-3 py-2 font-semibold rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200 flex items-center gap-2 text-sm', themeClasses.deleteButtonBg, themeClasses.deleteButtonText, themeClasses.deleteButtonHover, themeClasses.deleteButtonFocus]"
      >
        <i class="fas fa-trash-alt"></i> Delete
      </button>
    </div>
  </li>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed } from 'vue';

// Define the props this component expects
const props = defineProps({
  todo: {
    type: Object,
    required: true,
    validator: (value) => {
      // MongoDB uses _id, not id
      return '_id' in value && 'taskName' in value && 'status' in value;
    }
  },
  currentTheme: {
    type: String,
    required: true
  }
});

// Define the custom events this component can emit
const emit = defineEmits(['toggle-done', 'delete-todo', 'update-todo', 'update-priority']);

// Reactive state for editing mode
const isEditing = ref(false);
const editedTaskName = ref('');
const editedTaskDescription = ref('');
const editedTodoPriority = ref(''); // New ref for editing priority

// Watch for changes in the todo prop to update local editing state
watch(() => props.todo, (newTodo) => {
  editedTaskName.value = newTodo.taskName;
  editedTaskDescription.value = newTodo.taskDescription;
  editedTodoPriority.value = newTodo.priority; // Initialize edited priority
}, { immediate: true });

// Computed property to define theme-specific classes for TodoItem
const themeClasses = computed(() => {
  const basePriorityBg = {
    'Low': 'bg-blue-200', 'Medium': 'bg-yellow-200', 'High': 'bg-red-200'
  };
  const darkPriorityBg = {
    'Low': 'bg-blue-800', 'Medium': 'bg-yellow-800', 'High': 'bg-red-800'
  };

  const currentThemeColors = {
    light: {
      text: 'text-gray-800',
      dueDate: 'text-gray-500',
      completed: 'text-emerald-600',
      completedIcon: 'fas fa-check-circle text-emerald-500',
      pendingIcon: 'fas fa-clock text-yellow-500',
      editButtonBg: 'bg-blue-500',
      saveButtonBg: 'bg-green-500',
      cancelButtonBg: 'bg-gray-400',
      deleteButtonBg: 'bg-red-500',
      inputBorder: 'border-gray-300',
      inputBg: 'bg-white',
      inputText: 'text-gray-800',
      inputFocus: 'focus:ring-blue-400',
      listItemBg: props.todo.status === 'completed' ? 'bg-emerald-50' : 'bg-white',
      listItemBorder: props.todo.status === 'completed' ? 'border-emerald-200' : 'border-gray-200',
    },
    dark: {
      text: 'text-gray-100',
      dueDate: 'text-gray-400',
      completed: 'text-emerald-400',
      completedIcon: 'fas fa-check-circle text-emerald-400',
      pendingIcon: 'fas fa-clock text-yellow-400',
      editButtonBg: 'bg-blue-700',
      saveButtonBg: 'bg-green-700',
      cancelButtonBg: 'bg-gray-500',
      deleteButtonBg: 'bg-red-700',
      inputBorder: 'border-gray-500',
      inputBg: 'bg-gray-600',
      inputText: 'text-gray-100',
      inputFocus: 'focus:ring-blue-300',
      listItemBg: props.todo.status === 'completed' ? 'bg-emerald-900' : 'bg-gray-700',
      listItemBorder: props.todo.status === 'completed' ? 'border-emerald-700' : 'border-gray-600',
    },
    blue: {
      text: 'text-blue-900',
      dueDate: 'text-blue-600',
      completed: 'text-blue-700',
      completedIcon: 'fas fa-check-circle text-blue-600',
      pendingIcon: 'fas fa-clock text-cyan-500',
      editButtonBg: 'bg-indigo-500',
      saveButtonBg: 'bg-teal-500',
      cancelButtonBg: 'bg-gray-400',
      deleteButtonBg: 'bg-red-500',
      inputBorder: 'border-blue-300',
      inputBg: 'bg-white',
      inputText: 'text-blue-900',
      inputFocus: 'focus:ring-blue-500',
      listItemBg: props.todo.status === 'completed' ? 'bg-blue-50' : 'bg-white',
      listItemBorder: props.todo.status === 'completed' ? 'border-blue-200' : 'border-blue-300',
      saveButtonText: 'text-blue-900', // Override for blue theme
    },
    green: {
      text: 'text-green-900',
      dueDate: 'text-green-600',
      completed: 'text-green-700',
      completedIcon: 'fas fa-check-circle text-green-600',
      pendingIcon: 'fas fa-clock text-lime-500',
      editButtonBg: 'bg-emerald-500',
      saveButtonBg: 'bg-lime-500',
      cancelButtonBg: 'bg-gray-400',
      deleteButtonBg: 'bg-red-500',
      inputBorder: 'border-green-300',
      inputBg: 'bg-white',
      inputText: 'text-green-900',
      inputFocus: 'focus:ring-green-500',
      listItemBg: props.todo.status === 'completed' ? 'bg-green-50' : 'bg-white',
      listItemBorder: props.todo.status === 'completed' ? 'border-green-200' : 'border-green-300',
      saveButtonText: 'text-green-900', // Override for green theme
      editButtonText: 'text-green-900', // Override for green theme
    }
  };
  const colors = currentThemeColors[props.currentTheme] || currentThemeColors.light; // Fallback

  return {
    listItemBg: colors.listItemBg,
    listItemBorder: colors.listItemBorder,
    listItemHoverShadow: 'hover:shadow-md',
    taskContentText: colors.text,
    dueDateText: colors.dueDate,
    completedAtText: colors.completed,
    completedIcon: colors.completedIcon,
    pendingIcon: colors.pendingIcon,
    editButtonBg: colors.editButtonBg,
    editButtonText: colors.editButtonText || 'text-white', // Use specific text color if defined, else default to white
    editButtonHover: `hover:${colors.editButtonBg.replace(/-\d{3}/, '-600')}`,
    editButtonFocus: `focus:ring-${colors.editButtonBg.replace('bg-', '').replace(/-\d{3}/, '-400')}`,
    saveButtonBg: colors.saveButtonBg,
    saveButtonText: colors.saveButtonText || 'text-white', // Use specific text color if defined, else default to white
    saveButtonHover: `hover:${colors.saveButtonBg.replace(/-\d{3}/, '-600')}`,
    saveButtonFocus: `focus:ring-${colors.saveButtonBg.replace('bg-', '').replace(/-\d{3}/, '-400')}`,
    cancelButtonBg: colors.cancelButtonBg,
    cancelButtonText: colors.cancelButtonText || 'text-white', // Use specific text color if defined, else default to white
    cancelButtonHover: `hover:${colors.cancelButtonBg.replace(/-\d{3}/, '-500')}`,
    cancelButtonFocus: `focus:ring-${colors.cancelButtonBg.replace('bg-', '').replace(/-\d{3}/, '-300')}`,
    deleteButtonBg: colors.deleteButtonBg,
    deleteButtonText: colors.deleteButtonText || 'text-white', // Use specific text color if defined, else default to white
    deleteButtonHover: `hover:${colors.deleteButtonBg.replace(/-\d{3}/, '-600')}`,
    deleteButtonFocus: `focus:ring-${colors.deleteButtonBg.replace('bg-', '').replace(/-\d{3}/, '-400')}`,
    inputBorder: colors.inputBorder,
    inputBg: colors.inputBg,
    inputText: colors.inputText,
    inputFocusRing: colors.inputFocus,
    priorityBadgeBg: (priority) => basePriorityBg[priority] || 'bg-gray-200',
    priorityBadgeText: 'text-gray-800'
  };
});

/**
 * Initiates the editing mode.
 */
const startEditing = () => {
  isEditing.value = true;
  editedTaskName.value = props.todo.taskName;
  editedTaskDescription.value = props.todo.taskDescription;
  editedTodoPriority.value = props.todo.priority;
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
    id: props.todo._id,
    taskName: editedTaskName.value.trim(),
    taskDescription: editedTaskDescription.value.trim()
  });
  // If priority was edited, emit a separate event for it
  if (editedTodoPriority.value !== props.todo.priority) {
    emit('update-priority', { id: props.todo._id, newPriority: editedTodoPriority.value });
  }
  isEditing.value = false;
};

/**
 * Cancels editing and reverts to original task details.
 */
const cancelEditing = () => {
  isEditing.value = false;
  editedTaskName.value = props.todo.taskName;
  editedTaskDescription.value = props.todo.taskDescription;
  editedTodoPriority.value = props.todo.priority;
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
