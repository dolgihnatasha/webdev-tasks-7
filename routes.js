'use strict';

var index = (req, res) => res.render('index');
var error404 = (req, res) => res.sendStatus(404);

module.exports = function (app) {
    app.get('/', index);
    app.all('*', error404);
};
