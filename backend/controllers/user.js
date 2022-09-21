const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const salt = parseInt(process.env.SALT)

//fonction qui permet de créer un compte utilisateur et de venir salter et hasher le mdp pour la sécurité
exports.signup = (req, res, next) => {
    bcrypt.genSalt(salt)
        .then(saltRes => {
            bcrypt.hash(req.body.password, saltRes)
                .then(hash => {
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                        .catch(error => res.status(400).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
        })
};

//fonction qui permet la connexion en vérifiant que l'user existe et que le mdp est identique à celui dans la base de donnée
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            //si l'utilisateur n'existe pas
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //si le mdp n'est pas correct 
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            `'${process.env.TOKEN}'`,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};