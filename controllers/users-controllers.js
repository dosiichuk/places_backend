const uuid = require('uuid/v4');
const HttpError = require('../models/http-error');

const DUMMY_USERS = [
  { id: 'u1', name: 'Max', email: 'test@test.com', password: '111' },
];
const hhtpError = require('../models/http-error');

exports.getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

exports.signup = (req, res, next) => {
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError('User already exists', 422);
  }
  const createdUser = { id: uuid(), name, email, password };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({
    user: createdUser,
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Not identified user', 401);
  }
  res.json({ message: 'loggedin' });
};
