const router = require('express').Router();
const { addFavorite, getFavorites, deleteFavorite } = require('../controllers/favoriteController');

router.post('/:productId', addFavorite); 
router.get('/', getFavorites); 
router.delete('/:productId', deleteFavorite); 

module.exports = router;
