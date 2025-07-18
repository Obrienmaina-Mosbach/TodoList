// server/routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// @desc    Add a new todo
// @route   POST /api/todos
// @access  Public (for now)
router.post('/', async (req, res) => {
  console.log('POST /api/todos request received with body:', JSON.stringify(req.body, null, 2));
  const { taskName, taskDescription, dueDate, priority, status } = req.body;

  if (!taskName) {
    console.warn('POST /api/todos: Task name is missing.');
    return res.status(400).json({ message: 'Task name is required' });
  }

  try {
    console.log('Attempting to create new todo with data:', {
      taskName,
      taskDescription,
      dueDate,
      priority,
      status
    });

    const newTodo = await Todo.create({
      taskName,
      taskDescription,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      status,
      createdAt: new Date(),
      completedAt: status === 'completed' ? new Date() : null,
    });

    console.log('New todo created successfully:', newTodo._id);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error in POST /api/todos:', error.message);
    console.error('Full error details:', error);
    res.status(500).json({ 
      message: 'Error creating todo',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});