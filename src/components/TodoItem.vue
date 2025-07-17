<template>
  <li
    :class="[
      'flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg shadow-sm transition-all duration-300 ease-in-out',
      todo.status === 'completed' ? 'bg-emerald-50 border border-emerald-200' : 'bg-white border border-gray-200 hover:shadow-md'
    ]"
  >
    <div class="flex items-start md:items-center flex-grow mb-3 md:mb-0">
      <!-- Checkbox to toggle status -->
      <inputs
        type="checkbox"
        :checked="todo.status === 'completed'"
        @change="$emit('toggle-done', todo.id)"
        class="form-checkbox h-5 w-5 text-blue-600 rounded-md transition duration-150 ease-in-out cursor-pointer mr-3 mt-1 md:mt-0"
      />
      
      <!-- Task Content -->
      <div :class="['flex flex-col', { 'line-through text-gray-500': todo.status === 'completed' }]">
        <span class="font-semibold text-lg">{{ todo.taskName }}</span>
        <span v-if="todo.taskDescription" class="text-sm text-gray-600 mt-1">{{ todo.taskDescription }}</span>
      </div>
    </div>

    <!-- Task Actions -->
    <div class="flex items-center gap-3 ml-auto md:ml-0">
      <!-- Status Icon -->
      <i
        :class="[
          'text-xl',
          todo.status === 'completed' ? 'fas fa-check-circle text-emerald-500' : 'fas fa-clock text-yellow-500'
        ]"
      ></i>

      <!-- Delete Button -->
      <button
        @click="$emit('delete-todo', todo.id)"
        class="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200 flex items-center gap-2"
      >
        <i class="fas fa-trash-alt"></i>
        Delete
      </button>
    </div>
  </li>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Define the props this component expects
defineProps({
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
defineEmits(['toggle-done', 'delete-todo']);
</script>

<style scoped>


.form-checkbox:checked {
  border-color: transparent;
  background-color: #3b82f6; 
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 00-1.414 0L7 8.586 4.207 5.793a1 1 0 00-1.414 1.414l3.5 3.5a1 1 0 001.414 0l5-5a1 1 0 000-1.414z'/%3e%3c/svg%3e");
}
</style>
