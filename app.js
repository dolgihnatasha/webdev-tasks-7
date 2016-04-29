'use strict';

const path = require('path');
const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');

const viewsDir = path.join(__dirname, '.');
const publicDir = path.join(__dirname, '.');

app.set('views', viewsDir);
app.set('view engine', 'hbs');
app.use(express.static(publicDir));
hbs.registerPartials(path.join(__dirname, '.'));

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

require('./routes')(app);

app.listen(app.get('port'), () => console.log(`Listening on port ${app.get('port')}`));

module.exports = app;