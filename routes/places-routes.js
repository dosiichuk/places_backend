const express = require('express');

const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.use(auth);

router.post('/', fileUpload.single('image'), placesControllers.createPlace);

router.patch('/:pid', placesControllers.updatePlaceById);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
