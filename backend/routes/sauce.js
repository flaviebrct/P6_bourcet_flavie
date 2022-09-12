const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.post('/', auth, multer, sauceCtrl.createSauce);

//affichage de toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces);

//affichage d'une sauce selon son id
router.get('/:id', auth, sauceCtrl.getOneSauce);

module.exports = router;