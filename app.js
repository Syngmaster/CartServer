const express = require('express');
let app = express();
const db = require('./db');
let middleware = require('./middleware');

let cartController = require('./cart/CartController');
app.use(middleware.checkToken);
app.use('/api', cartController);

module.exports = app;