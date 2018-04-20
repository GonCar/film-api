const express = require('express');
const router = express.Router();
const uploadConfig = require('../configs/multer.config');
const itemsController = require('../controllers/items.controller');
const validIdMiddleware = require('../middleware/validId.middleware');
const secureMiddleware = require('../middleware/secure.middleware');

router.get('/favs', secureMiddleware.isAuthenticated, itemsController.favlist);
router.get('/', itemsController.list);
router.get('/genres', itemsController.genres);
router.get('/:id', validIdMiddleware.checkValidId, itemsController.get);
router.post('/', secureMiddleware.isAuthenticated, uploadConfig.single('image'), itemsController.create);
router.put('/fav', secureMiddleware.isAuthenticated, itemsController.addToFav);
router.put('/:id', secureMiddleware.isAuthenticated, uploadConfig.single('image'), itemsController.edit);
router.delete('/:id', secureMiddleware.isAuthenticated, validIdMiddleware.checkValidId, itemsController.delete);

module.exports = router;
