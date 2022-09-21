const validator = require('validator');

module.exports = (req, res, next) => {
    //si l'email renseigné est valide
    if (validator.isEmail(req.body.email)) {
        next();
    } else {
        res.status(401).json({ message: "Cet email n'est pas valide." })
    }
}  