var AV = require('leanengine');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(req, res) {
  res.success('Hello world!');
});

AV.Cloud.define('test', function(req, res) {
  var r = {};
  r.valume = 1000;
  r.now = new Date();
  var query = new AV.Query('Record');

  query.lessThan("recordedAt", r.now);
  query.descending('recordedAt');
  query.limit(1);
  query.find({
    success: function(results) {
      //console.log(results)
      if (results.length > 0)
        r.lastRecord = results[0];

      res.success(r);
    },
    error: function(error) {
      console.error('Error finding last record ' + error.code + ': ' + error.message);
    }
  });
});

AV.Cloud.define('getLastIrr', function(req, res) {
  var r = {};
  r.now = new Date();
  //r.now = Date.now();
  var query = new AV.Query('Record');
  var date = req.params.date;
  if (!date)
    date = r.now;
  console.log(date)
  query.lessThan("recordedAt", date);
  query.descending('recordedAt');
  query.limit(1);
  query.find({
    success: function(results) {
      //console.log(results)
      if (results.length > 0) {
        var lastRecord = results[0];
        r.lastIrr = lastRecord.get('irrigationVolume');
      }

      res.success(r);
    },
    error: function(error) {
      console.error('Error finding last record ' + error.code + ': ' + error.message);
    }
  });
});

AV.Cloud.beforeSave('Record', function(request, response) {
  var record = request.object;
  var query = new AV.Query('Record');
  //console.log("recordedAt:" + record.get('recordedAt'))
  query.equalTo("userId", record.get('userId'));
  query.lessThanOrEqualTo("recordedAt", record.get('recordedAt'));
  query.descending('recordedAt');
  query.limit(1);
  query.find({
    success: function(results) {
      //console.log(results)
      var lastIrr = 0;
      if (results.length > 0)
        lastIrr = results[0].get('irrigationVolume');
      else
        lastIrr = request.object.get('irrigationVolume')

      //console.log("  " + results[0].id + "  lastIrr:" + lastIrr);
      var dra = record.get('drainageVolume');
      var ult = dra - lastIrr;
      //console.log("  " + dra + "  lastIrr:" + lastIrr + "  ult:" + ult);
      request.object.set('ultrafiltrationVolume', ult);

      response.success();
    },
    error: function(error) {
      console.error('Error finding last record ' + error.code + ': ' + error.message);
    }
  });
});

module.exports = AV.Cloud;
