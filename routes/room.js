var express = require('express');
var util = require('./util.js');
var router = express.Router();

router.get('/', function(req, res) {

    res.redirect('/room/' + util.randomNumber(6));
    //res.render('partials/go', {
    //    title: 'Chess Hub - Game',
    //    user: req.user,
    //    isPlayPage: true
    //});
});

router.post('/', function(req, res) {
    var side = req.body.side;
    //var opponent = req.body.opponent; // playing against the machine in not implemented
    var token = util.randomString(20);
    res.redirect('/space/' + token + '/' + side);
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    var side = 'life';

    res.render('partials/room', {
        title: 'Go of Life · 双人对弈' + id,
        user: req.user,
        isPlayPage: true,
        token: id,
        side: side
    });
});

module.exports = router;