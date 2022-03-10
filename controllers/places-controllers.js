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

exports.getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((place) => place.creator === userId);
  if (!places || places.length === 0) {
    return next(new HttpError('Could not find places'));
  }
  res.json({ places });
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
    console.log(err);
    const error = new HttpError('Creating a place failed');
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

exports.updatePlaceById = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIndex] = updatedPlace;
  res.status(200).json({
    place: updatedPlace,
  });
};

exports.deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(201).json({
    message: 'deleted',
  });
};
