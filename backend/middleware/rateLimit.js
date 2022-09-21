const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
    max: 5, //chaque IP est limité à 5 tentatives par windowMs 
    windowMs: 15 * 60 * 1000, //15 minutes
    message: "Trop de tentatives de connexion, veuillez réessayer plus tard.",
});

module.exports = limiter