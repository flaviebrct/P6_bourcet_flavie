var passwordValidator = require('password-validator');

//Création d'un schema de mdp
var passwordSchema = new passwordValidator();

//Ajout des propriétés nécessaires
passwordSchema
.min(6, 'Le mot de passe doit contenir au moins 6 caractères.')           // Min 6 caractères
.max(15, 'Le mot de passe doit contenir moins de 15 caractères.')         // Max 15 caractères
.uppercase(1, 'Le mot de passe doit contenir au moins 1 majuscule.')      // Au moins 1 MAJ
.lowercase(1, 'Le mot de passe doit contenir au moins 1 minuscule.')      // Au moins 1 MIN
.digits(1, 'Le mot de passe doit contenir au moins 1 chiffre.')            // Au moins 1 chiffre
.has().not().spaces();                                                    // Ne doit pas avoir d'espaces

module.exports = (req, res, next) => {
    //si le mdp correspond aux critères du schema
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        res.status(401).json({ message: 'Le mot de passe doit contenir au moins 6 caractères dont une majuscule, une minuscule et un chiffre.' })
    }
}