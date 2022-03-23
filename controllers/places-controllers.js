const HttpError = require('../models/http-error');

const Place = require('./../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  console.log(placeId);

  try {
    const place = await Place.findById(placeId);

    return res.json({
      message: 'it works',
      place,
    });
  } catch (err) {
    const error = new HttpError('Could not find by ID', 404);
    return next(error);
  }
};

exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError('Could not fetch places', 500);
    return next(error);
  }
  if (!places || places.length === 0) {
    return next(new HttpError('Could not find places'));
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

exports.createPlace = async (req, res, next) => {
  const { title, description, location, address, creator } = req.body;
  const createdPlace = new Place({
    title,
    description,
    location,
    address,
    image:
      'https://media.istockphoto.com/photos/low-angle-of-tall-building-in-manhattan-picture-id1291177121',
    creator,
  });
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating place failed', 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError('Could not find user by Id', 404);
    return next(error);
  }
  console.log('user', user);
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Creating a place failed');
    console.log(err);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

exports.updatePlaceById = async (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.find({ id: placeId });
  } catch (err) {
    const error = new HttpError('Updating a place failed');
    return next(error);
  }

  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError('Update failed');
    return next(error);
  }
  res.status(200).json({
    place,
  });
};

exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    place = await Place.findById(placeId).populate('creator');
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Deletion failed');
    return next(error);
  }
  if (!place) {
    const error = new HttpError('Could not find place for id', 404);
    return next(error);
  }
  res.status(201).json({
    message: 'deleted',
  });
};
