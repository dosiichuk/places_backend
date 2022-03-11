const HttpError = require('../models/http-error');
const { v4: uuidv4 } = require('uuid');
const Place = require('./../models/place');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'sefgrfg',
    description: 'ergfeqragre',
    location: {
      lat: 40.4,
      lng: 40.4,
    },
    address: 'herfbiewrf',
    creator: 'u1',
  },
];

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
    creator,
    image:
      'https://media.istockphoto.com/photos/low-angle-of-tall-building-in-manhattan-picture-id1291177121',
    creator,
  });
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError('Creating a place failed');
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

  try {
    await Place.findByIdAndDelete(placeId);
  } catch (err) {
    const error = new HttpError('Deletion failed');
    return next(error);
  }
  res.status(201).json({
    message: 'deleted',
  });
};
