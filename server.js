var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var logger = require('morgan');
var app = express();

app.get('/scrape', function (req, res) {

    //All the web scraping magic will happen here

    url = 'http://127.0.0.1/projects/logs/slave1.log';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function (error, response, html) {

        // First we'll check to make sure no errors occurred when making the request

        /* if (!error) {
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            var title, release, rating;
            var json = {
                title: "",
                release: "",
                rating: ""
            };
        } */
        console.log(typeof html);
        var date = "2018-02-17";

        var n = html.indexOf(date);
        var r = html.substring(n, html.length - 1);

        if (error) {
            res.status(500).send(error)
        } else {
            res.status(200).send(r)
        }
    });

});

var server = app.listen(9500, function () {
    var port = server.address().port
    console.log("App listening on port %s", port);
});

exports = module.exports = app;