const express = require('express');
const albumsController = require('../controllers/albums');
const router = express.Router();


router.post('/:id/albums', albumsController.createAlbum);

router.get('/', albumsController.readAlbum);

router.get('/:id', albumsController.getAlbumById);

router.patch('/:id', albumsController.updateAlbum);

router.delete('/:id', albumsController.deleteAlbum);

module.exports = router;
