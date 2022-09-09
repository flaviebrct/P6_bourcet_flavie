const express = require('express');
const helmet = require("helmet");
const mongoose = require('mongoose');
const path = require('path');


const dotenv = require("dotenv");
dotenv.config();
const app = express();
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

app.use(helmet());
app.use(express.json());

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');  
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');  
  next();
});


app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;