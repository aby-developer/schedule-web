const express = require('express');
const router = express.Router();
const { register, login, registerValidators, loginValidators } = require('../controllers/authController');
const validate = require('../middleware/validate');

router.post('/register', registerValidators, validate, register);
router.post('/login', loginValidators, validate, login);

module.exports = router;
