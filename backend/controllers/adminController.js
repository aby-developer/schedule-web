const User = require('../models/User');
const Todo = require('../models/Todo');

// Admin: get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Admin: get all todos (optionally by user)
const getAllTodos = async (req, res) => {
  const { userId } = req.query;
  const query = {};
  if (userId) query.user = userId;
  try {
    const todos = await Todo.find(query).populate('user', 'name email').sort({ createdAt: -1 });
    return res.json(todos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Admin: delete a user and optionally their todos
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await Todo.deleteMany({ user: userId }); // remove user's todos
    await User.findByIdAndDelete(userId);
    return res.json({ message: 'User and their todos deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Admin: change user's role (promote / demote)
const changeUserRole = async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = role;
    await user.save();
    return res.json({ message: 'User role updated', user: { id: user._id, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllUsers, getAllTodos, deleteUser, changeUserRole };
