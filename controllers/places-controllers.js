const HttpError = require('../models/http-error');
const uuid = require('uuid/v4');

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

exports.getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  console.log('get from places');
  const place = DUMMY_PLACES.find((place) => place.id === placeId);
  if (!place) {
    throw new HttpError('Could not find place');
  }
  res.json({
    message: 'it works',
    place,
  });
};

exports.getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((place) => place.creator === userId);
  if (!places || places.length === 0) {
    return next(new HttpError('Could not find places'));
  }
  res.json({ places });
};

exports.createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);
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
