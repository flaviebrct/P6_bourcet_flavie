const jwt = require('jsonwebtoken');


//On récuprère l'userId en décodant le token afin de vérifié l'authentification de l'utilisateur 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `'${process.env.TOKEN}'`);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        // Si il y a un userId et qu'il n'est pas le même que celui du header de la requete
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({ error : new Error("Utilisateur non authentifié") });
    }
};