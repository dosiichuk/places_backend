const express = require('express');

const usersControllers = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.post('/signup', fileUpload.single('image'), usersControllers.signup);

router.post('/login', usersControllers.login);

module.exports = router;
