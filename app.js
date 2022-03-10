const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/places/', placesRoutes); ///api/places/
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find route');
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next();
  }
  res.status(error.code || 500).json({
    message: error.message || 'Unknown error occured',
  });
});
DB_URL = process.env.DB.replace('<password>', process.env.DB_PASSWORD);
mongoose.connect(DB_URL).then(() => {
  console.log('DB connection running');
});

app.listen(5000);
