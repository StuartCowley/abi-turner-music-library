const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist');


router.post('/', artistController.createArtist);

router.get('/', artistController.getAllArtists);

router.get('/:id', artistController.getArtistById);

router.patch('/:id', artistController.updateArtist);

router.delete('/:id', artistController.deleteArtistById);

module.exports = router;
