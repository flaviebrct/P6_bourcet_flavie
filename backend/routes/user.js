const express = require('express');
const router = express.Router();
const password = require('../middleware/password');
const email = require('../middleware/email');
const limiter = require('../middleware/rateLimit');

const userCtrl = require('../controllers/user');

//création d'un compte avec verification de l'email ainsi que d'un mdp sécurisé
router.post('/signup', email, password, userCtrl.signup);

//connexion d'un utilisateur avec limitation des tentatives de connexion
router.post('/login', limiter, userCtrl.login);

module.exports = router;