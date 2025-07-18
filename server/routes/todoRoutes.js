// server/routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo'); // Import the Todo model

// @desc    Get all todos
// @route   GET /api/todos
// @access  Public (for now)
router.get('/', async (req, res) => {
  console.log('GET /api/todos request received.'); // Log 1: Request received
  try {
    console.log('Attempting to fetch todos from DB...'); // Log 2: Before DB call
    const todos = await Todo.find({});
    console.log(`Fetched ${todos.length} todos from DB.`); // Log 3: After successful DB call
    res.status(200).json(todos);
    console.log('Response sent for GET /api/todos.'); // Log 4: After response sent
  } catch (error) {
    console.error('Error in GET /api/todos:', error.message); // Log 5: Error caught
    console.error('Full GET /api/todos error details:', error); // Log 6: Full error object
    res.status(500).json({ message: error.message });
    console.log('Error response sent for GET /api/todos.'); // Log 7: Error response sent
  }
});

// @desc    Add a new todo
// @route   POST /api/todos
// @access  Public (for now)
router.post('/', async (req, res) => {
  console.log('POST /api/todos request received.'); // Log 1: Request received
  const { taskName, taskDescription, dueDate, priority, status } = req.body;

  if (!taskName) {
    console.warn('POST /api/todos: Task name is missing.'); // Log for bad request
    return res.status(400).json({ message: 'Task name is required' });
  }

  try {
    console.log('Attempting to create new todo in DB...'); // Log 2: Before DB call
    const newTodo = await Todo.create({
      taskName,
      taskDescription,
      dueDate: dueDate ? new Date(dueDate) : null, // Convert to Date object
      priority,
      status,
      createdAt: new Date(), // Ensure createdAt is set
      completedAt: status === 'completed' ? new Date() : null, // Set completedAt if status is completed
    });
    console.log('New todo created in DB:', newTodo._id); // Log 3: After successful DB call
    res.status(201).json(newTodo);
    console.log('Response sent for POST /api/todos.'); // Log 4: After response sent
  } catch (error) {
    console.error('Error in POST /api/todos:', error.message); // Log 5: Error caught
    console.error('Full POST /api/todos error details:', error); // Log 6: Full error object
    res.status(500).json({ message: error.message });
    console.log('Error response sent for POST /api/todos.'); // Log 7: Error response sent
  }
});

// @desc    Clear all completed todos
// @route   DELETE /api/todos/completed
// @access  Public (for now)
router.delete('/completed', async (req, res) => {
  console.log('DELETE /api/todos/completed request received.'); // Log 1: Request received
  try {
    console.log('Attempting to delete completed todos from DB...'); // Log 2: Before DB call
    const result = await Todo.deleteMany({ status: 'completed' });
    console.log(`Deleted ${result.deletedCount} completed todos from DB.`); // Log 3: After successful DB call
    res.status(200).json({ message: 'All completed todos removed' });
    console.log('Response sent for DELETE /api/todos/completed.'); // Log 4: After response sent
  } catch (error) {
    console.error('Error in DELETE /api/todos/completed:', error.message); // Log 5: Error caught
    console.error('Full DELETE /api/todos/completed error details:', error); // Log 6: Full error object
    res.status(500).json({ message: error.message });
    console.log('Error response sent for DELETE /api/todos/completed.'); // Log 7: Error response sent
  }
});

// @desc    Update a todo (status, name, description, priority)
// @route   PUT /api/todos/:id
// @access  Public (for now)
router.put('/:id', async (req, res) => {
  console.log(`PUT /api/todos/${req.params.id} request received.`); // Log 1: Request received
  try {
    console.log(`Attempting to find todo ${req.params.id} in DB for update...`); // Log 2: Before DB find
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      console.warn(`PUT /api/todos/${req.params.id}: Todo not found.`); // Log for not found
      return res.status(404).json({ message: 'Todo not found' });
    }

    console.log(`Todo ${req.params.id} found. Updating fields...`); // Log 3: After find, before update
    // Update fields
    if (req.body.taskName !== undefined) todo.taskName = req.body.taskName;
    if (req.body.taskDescription !== undefined) todo.taskDescription = req.body.taskDescription;
    if (req.body.priority !== undefined) todo.priority = req.body.priority;
    if (req.body.dueDate !== undefined) todo.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;

    // Handle status change and completedAt timestamp
    if (req.body.status !== undefined && todo.status !== req.body.status) {
      todo.status = req.body.status;
      if (req.body.status === 'completed') {
        todo.completedAt = new Date();
      } else {
        todo.completedAt = null;
      }
    }

    await todo.save();
    console.log(`Todo ${todo._id} updated successfully.`); // Log 4: After successful save
    res.status(200).json(todo);
    console.log(`Response sent for PUT /api/todos/${req.params.id}.`); // Log 5: After response sent
  } catch (error) {
    console.error(`Error in PUT /api/todos/${req.params.id}:`, error.message); // Log 6: Error caught
    console.error(`Full PUT /api/todos/${req.params.id} error details:`, error); // Log 7: Full error object
    res.status(500).json({ message: error.message });
    console.log(`Error response sent for PUT /api/todos/${req.params.id}.`); // Log 8: Error response sent
  }
});

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
  console.log(`DELETE /api/todos/${req.params.id} request received.`); // Log 1: Request received
  try {
    console.log(`Attempting to find todo ${req.params.id} in DB for deletion...`); // Log 2: Before DB find
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      console.warn(`DELETE /api/todos/${req.params.id}: Todo not found.`); // Log for not found
      return res.status(404).json({ message: 'Todo not found' });
    }

    await todo.deleteOne(); // Use deleteOne() for Mongoose 6+
    console.log(`Todo ${req.params.id} deleted successfully.`); // Log 3: After successful deletion
    res.status(200).json({ message: 'Todo removed' });
    console.log(`Response sent for DELETE /api/todos/${req.params.id}.`); // Log 4: After response sent
  } catch (error) {
    console.error(`Error in DELETE /api/todos/${req.params.id}:`, error.message); // Log 5: Error caught
    console.error(`Full DELETE /api/todos/${req.params.id} error details:`, error); // Log 6: Full error object
    res.status(500).json({ message: error.message });
    console.log(`Error response sent for DELETE /api/todos/${req.params.id}.`); // Log 7: Error response sent
  }
});

module.exports = router;
