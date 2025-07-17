// server/routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo'); // Import the Todo model

// @desc    Get all todos
// @route   GET /api/todos
// @access  Public (for now)
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a new todo
// @route   POST /api/todos
// @access  Public (for now)
router.post('/', async (req, res) => {
  const { taskName, taskDescription, dueDate, priority, status } = req.body;

  if (!taskName) {
    return res.status(400).json({ message: 'Task name is required' });
  }

  try {
    const newTodo = await Todo.create({
      taskName,
      taskDescription,
      dueDate: dueDate ? new Date(dueDate) : null, // Convert to Date object
      priority,
      status,
      createdAt: new Date(), // Ensure createdAt is set
      completedAt: status === 'completed' ? new Date() : null, // Set completedAt if status is completed
    });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Clear all completed todos
// @route   DELETE /api/todos/completed
// @access  Public (for now)
router.delete('/completed', async (req, res) => {
  try {
    await Todo.deleteMany({ status: 'completed' });
    res.status(200).json({ message: 'All completed todos removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a todo (status, name, description, priority)
// @route   PUT /api/todos/:id
// @access  Public (for now)
router.put('/:id', async (req, res) => {
  try {
    const { taskName, taskDescription, status, dueDate, priority } = req.body;
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Update fields
    if (taskName !== undefined) todo.taskName = taskName;
    if (taskDescription !== undefined) todo.taskDescription = taskDescription;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate ? new Date(dueDate) : null;

    // Handle status change and completedAt timestamp
    if (status !== undefined && todo.status !== status) {
      todo.status = status;
      if (status === 'completed') {
        todo.completedAt = new Date();
      } else {
        todo.completedAt = null;
      }
    }

    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await todo.deleteOne(); // Use deleteOne() for Mongoose 6+
    res.status(200).json({ message: 'Todo removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
