const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
  const { name, email, password } = req.body;
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
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not create user', 500);
    return next(error);
  }
  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });
  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Could not save user', 500);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.TOKEN_SECRET,
      { expiresIn: '12h' }
    );
  } catch (err) {
    return next(new HttpError('signup failed'));
  }
  res.status(201).json({
    user: createdUser.toObject({ getters: true }),
    token,
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
  if (!existingUser) {
    const error = new HttpError('Invalid credentials', 401);
    return next(error);
  }
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError('Invalid credentials', 500);
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError('Invalid credentials', 500);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.TOKEN_SECRET,
      { expiresIn: '12h' }
    );
  } catch (err) {
    return next(new HttpError('signup failed'));
  }

  res.json({
    message: 'logged in',
    user: existingUser.toObject({ getters: true }),
    token,
  });
};
