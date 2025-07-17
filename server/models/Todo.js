// server/models/Todo.js
const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema(
  {
    taskName: {
      type: String,
      required: [true, 'Please add a task name'],
      trim: true,
    },
    taskDescription: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    dueDate: {
      type: Date, // Store as Date object
      default: null,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically if not defined above
  }
);

module.exports = mongoose.model('Todo', TodoSchema);
