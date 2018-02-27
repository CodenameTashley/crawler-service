var bodyParser = require('body-parser'),
    cheerio = require('cheerio'),
    express = require('express'),
    fs = require('fs'),
    logger = require('morgan'),
    request = require('request'),
    config = require('./app.config.json');

var app = express();
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/slaves', function (req, res) {
    res.status(200).send(config.slaves);
});

app.get('/logByDate', function (req, res) {
    console.log("req.query", req.query);

    url = 'http://127.0.0.1/projects/logs/slave1.log';

    request(url, function (error, response, html) {

        var date = req.query.date;

        var startingPositionOfDate = html.indexOf(date);
        if (startingPositionOfDate === -1) {
            return res.status(404).send("Not found");
        }

        var logsAsFromDate = html.substring(startingPositionOfDate, html.length - 1);

        var logsOfDate = logsAsFromDate.split("\n").filter(function (log) {
            return log.indexOf(date) !== -1;
        }).join("\n");

        var logsOfWrite = logsOfDate.split("\n").filter(function (log) {
            return log.indexOf("HDFS_WRITE") !== -1;
        });



        if (error) {
            res.status(500).send(error)
        } else {
            res.status(200).send(logsOfWrite.join("<br/>"));
        }
    });

});

var server = app.listen(9500, function () {
    var port = server.address().port
    console.log("App listening on port %s", port);
});

exports = module.exports = app;