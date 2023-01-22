const userController = require('../controllers/userController')
const router = require('express').Router();

router.post('/add',userController.addToLikedMovies)

module.exports = router;