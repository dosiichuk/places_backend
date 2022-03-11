const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
  { id: 'u1', name: 'Max', email: 'test@test.com', password: '111' },
];
const hhtpError = require('../models/http-error');

exports.getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

exports.signup = async (req, res, next) => {
  const { name, email, password, image, places } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Could not find user', 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError('User exists already, please login', 422);
    return next(error);
  }
  const createdUser = new User({ name, email, password, image, places });
  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Could not save user', 500);
    return next(error);
  }
  res.status(201).json({
    user: createdUser.toObject({ getters: true }),
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError('Not identified user', 401));
  }
  res.json({ message: 'loggedin' });
};
