var User = require('../models/User');
var apiHandler = require('../libs/ApiHandler');

exports.postUser = function(req, res) {
    console.log(req.body);
    var name = req.body.name;
    var side = req.body.side;

    //var opponent = req.body.opponent; // playing against the machine in not implemented
    var id = util.randomString(20);
    res.redirect('/room/' + id + '/' + side);
};

exports.udpateScore = function(req, res) {
    var score = req.body.score;
    var id = req.body.id;

    return User.findOneAndUpdate({_id: id}, {score: score}, function(err, doc){
        if (err) {
            apiHandler.OUTER_DEF(res, err);
        }

        if (doc) {
            apiHandler.OK(res, {
                msg: "ok"
            });
        }
    })
}

exports.getLeaderbord = function(req, res) {
    var id = req.params.id;
    var side = 'life';

};

exports.test = function(req, res) {
    apiHandler.OK(res, {
        msg: "user ok"
    })
}