const router = require('express').Router();
const { addBasket, getBaskets, deleteBasket } = require('../controllers/basketsController');

router.post('/', addBasket);
router.post('/:productId', addBasket); 
router.get('/', getBaskets); 
router.delete('/:productId', deleteBasket); 

module.exports = router;
