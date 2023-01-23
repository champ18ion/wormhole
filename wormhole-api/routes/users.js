const userController = require('../controllers/userController')
const router = require('express').Router();

router.post('/add',userController.addToLikedMovies)
router.get('/liked/:email',userController.getLikedMovies)
router.put('/delete/',userController.removeFromLikedMovies)
module.exports = router;