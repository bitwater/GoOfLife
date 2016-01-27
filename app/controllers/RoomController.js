var util = require('../configs/util.js');

exports.getRoom = function(req, res) {
    var id = util.randomNumber(6);

    res.redirect('/room/' + id);
    //res.render('partials/go', {
    //    title: 'Chess Hub - Game',
    //    user: req.user,
    //    isPlayPage: true
    //});
};

exports.postRoom = function(req, res) {
    var side = req.body.side;
    //var opponent = req.body.opponent; // playing against the machine in not implemented
    var id = util.randomString(20);
    res.redirect('/room/' + id + '/' + side);
};

exports.getRoomById = function(req, res) {
    var id = req.params.id;
    var side = 'life';

    res.render('partials/room', {
        title: 'Go of Life · 双人对弈 | ' + id,
        user: req.user,
        isPlayPage: true,
        id: id,
        side: side
    });
};
