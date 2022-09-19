const Sauce = require('../models/sauce');
const fs = require('fs');

//fonction qui permet de créer une sauce à partir du body de la requête et du modèle sauce établit
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

//fonction qui permet de modifier une fiche de sauce en créant une nouvelle fiche et supprimant l'ancienne
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

//fonction qui permet de supprimer une fiche grâce à son ID
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

//fonction qui permet de liker ou disliker une sauce
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //Si l'user n'as pas encore liked la sauce et qu'il en fait la requête alors on fait likes +1 
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                Sauce.updateOne({ _id: req.params.id }, {$inc: {likes: +1}, $push: {usersLiked : req.body.userId}})
                .then(() => { res.status(200).json({ message: 'Sauce likée !'}) })
                .catch(error => res.status(400).json({ error }));
            }
            //Si l'user a déjà liked la sauce et qu'il veut retirer son like alors on fait likes -1
            else if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
                Sauce.updateOne({ _id: req.params.id }, {$inc: {likes: -1}, $pull: {usersLiked : req.body.userId}})
                .then(() => { res.status(200).json({ message: 'Like retiré !'}) })
                .catch(error => res.status(400).json({ error }));
            }
            //Si l'user n'as pas encore disliked la sauce et qu'il en fait la requête alors on fait dislikes +1
            else if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                Sauce.updateOne({ _id: req.params.id }, {$inc: {dislikes: +1}, $push: {usersDisliked : req.body.userId}})
                .then(() => { res.status(200).json({ message: 'Sauce dislikée !'}) })
                .catch(error => res.status(400).json({ error }));
            }
            //Si l'user a déjà disliked la sauce et qu'il veut retirer son dislike alors on fait dislikes -1
            else if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
                Sauce.updateOne({ _id: req.params.id }, {$inc: {dislikes: -1}, $pull: {usersDisliked : req.body.userId}})
                .then(() => { res.status(200).json({ message: 'Dislike retiré !'}) })
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

// fonction affichage de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// fonction qui affiche une sauce selon l'id recueillis dans la requête
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};