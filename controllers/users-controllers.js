const HttpError = require('../models/http-error');
const User = require('../models/user');

exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Smth went wrong', 500);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

exports.signup = async (req, res, next) => {
  const { name, email, password, image } = req.body;
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
  const createdUser = new User({ name, email, password, image, places: [] });
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

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Login failed', 500);
    return next(error);
  }
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError('Invalid credentials', 401);
    return next(error);
  }

  res.json({ message: 'logged in' });
};
