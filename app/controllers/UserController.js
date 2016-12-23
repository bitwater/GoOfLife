var User = require('../models/User');


exports.postUser = function(req, res) {
    console.log(req.body);

    var score = req.body.score;
    var id = req.body.id;
    var name = req.body.name;
    var side = req.body.side;

    //var opponent = req.body.opponent; // playing against the machine in not implemented
    var id = util.randomString(20);
    res.redirect('/room/' + id + '/' + side);
};

exports.udpateScore = function(req, res) {
    var score = req.body.score;
    var id = req.body.id;

    return User.findOneAndUpdate({openId: openId}, {score: score}, function(err, doc){
        if (err) {

        }

        if (doc) {

        }
    })
}

exports.getLeaderbord = function(req, res) {
    var id = req.params.id;
    var side = 'life';


};
