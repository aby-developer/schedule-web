const Todo = require('../models/Todo');
const { body } = require('express-validator');

// validators for create / update
const todoValidators = [
  body('title').notEmpty().withMessage('Title is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
];

// GET /api/todos?filter=all|active|completed&q=text&sort=newest|oldest
const getTodos = async (req, res) => {
  const { filter = 'all', q, sort = 'newest' } = req.query;
  const query = { user: req.user.id };

  if (filter === 'active') query.completed = false;
  if (filter === 'completed') query.completed = true;
  if (q) query.title = { $regex: q, $options: 'i' };

  const sortObj = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  try {
    const todos = await Todo.find(query).sort(sortObj);
    return res.json(todos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const createTodo = async (req, res) => {
  const { title, description, dueDate, labels = [], priority = 'medium' } = req.body;
  try {
    const todo = new Todo({
      user: req.user.id,
      title,
      description,
      dueDate,
      labels,
      priority
    });
    await todo.save();
    return res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateTodo = async (req, res) => {
  const updates = req.body; // allow partial updates
  try {
    let todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    if (todo.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(todo, updates);
    await todo.save();
    return res.json(todo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    if (todo.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await todo.deleteOne();
    return res.json({ message: 'Todo removed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo, todoValidators };
