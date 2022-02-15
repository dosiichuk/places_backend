const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');

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

app.listen(5000, () => {
  console.log('listeing');
});
