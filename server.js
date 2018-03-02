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

app.get('/logByDateAndSlave', function (req, res) {
    console.log("req.query", req.query);

    var url = 'http://127.0.0.1/projects/logs/slave1.log';

    var req_slave = JSON.parse(req.query.slave) || {};
    if (req_slave.url && req.query.slave.url != "" ) {
        url = req_slave.url;
    }
    console.log(req_slave.url)

    request(url, function (error, response, html) {
        
        if (!html) {
            console.log("asd")
            return res.status(200).send("Log server cannot be reached.");
        }

        var date = req.query.date;

        var startingPositionOfDate = html.indexOf(date);
        if (startingPositionOfDate === -1) {
            return res.status(200).send("No log found.");
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
            res.status(200).send(logsOfWrite);
        }
    });

});

var server = app.listen(9500, function () {
    var port = server.address().port
    console.log("App listening on port %s", port);
});

exports = module.exports = app;