const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTodos, createTodo, updateTodo, deleteTodo, todoValidators } = require('../controllers/todoController');
const validate = require('../middleware/validate');

router.get('/', auth, getTodos);
router.post('/', auth, todoValidators, validate, createTodo);
router.put('/:id', auth, todoValidators, validate, updateTodo);
router.delete('/:id', auth, deleteTodo);

module.exports = router;
