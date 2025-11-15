const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const adminController = require('../controllers/adminController');

router.use(auth); // all admin routes require auth
router.use(role('admin')); // and must be admin

router.get('/users', adminController.getAllUsers);
router.get('/todos', adminController.getAllTodos);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/role', adminController.changeUserRole);

module.exports = router;
