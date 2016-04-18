"use strict";
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var config = require('config');
var twitter = require('twitter');

var client = new twitter(config.get('twitter'));

// console.log(config.get('twitter'))
server.listen(8000);
io.set("origins", "*:*");
let stateCount = {
    "AL": 0,
    "AK": 0,
    "AS": 0,
    "AZ": 0,
    "AR": 0,
    "CA": 0,
    "CO": 0,
    "CT": 0,
    "DE": 0,
    "DC": 0,
    "FM": 0,
    "FL": 0,
    "GA": 0,
    "GU": 0,
    "HI": 0,
    "ID": 0,
    "IL": 0,
    "IN": 0,
    "IA": 0,
    "KS": 0,
    "KY": 0,
    "LA": 0,
    "ME": 0,
    "MH": 0,
    "MD": 0,
    "MA": 0,
    "MI": 0,
    "MN": 0,
    "MS": 0,
    "MO": 0,
    "MT": 0,
    "NE": 0,
    "NV": 0,
    "NH": 0,
    "NJ": 0,
    "NM": 0,
    "NY": 0,
    "NC": 0,
    "ND": 0,
    "MP": 0,
    "OH": 0,
    "OK": 0,
    "OR": 0,
    "PW": 0,
    "PA": 0,
    "PR": 0,
    "RI": 0,
    "SC": 0,
    "SD": 0,
    "TN": 0,
    "TX": 0,
    "UT": 0,
    "VT": 0,
    "VI": 0,
    "VA": 0,
    "WA": 0,
    "WV": 0,
    "WI": 0,
    "WY": 0
};
var tweet = 100,
filter = 'beer';
const states = new RegExp(/AL|Alabama|AK|Alaska|AZ|Arizona|AR|Arkansas|CA|California|CO|Colorado|CT|Connecticut|DE|Delaware|FL|Florida|GA|Georgia|HI|Hawaii|ID|Idaho|IL|Illinois|IN|Indiana|IA|Iowa|KS|Kansas|KY|Kentucky|LA|Louisiana|ME|Maine|MD|Maryland|MA|Massachusetts|MI|Michigan|MN|Minnesota|MS|Mississippi|MO|Missouri|MT|Montana|NE|Nebraska|NV|Nevada|NH|New Hampshire|NJ|New Jersey|NM|New Mexico|NY|New York|NC|North Carolina|ND|North Dakota|OH|Ohio|OK|Oklahoma|OR|Oregon|PA|Pennsylvania|RI|Rhode Island|SC|South Carolina|SD|South Dakota|TN|Tennessee|TX|Texas|UT|Utah|VT|Vermont|VA|Virginia|WA|Washington|WV|West Virginia|WI|Wisconsin|WY|Wyoming/);

function twitterStream(socket, _filter){
    client.stream('statuses/filter', { track: _filter }, function(stream) {
        stream.on('data', function(_tweet) {
            tweet = _tweet
            if(tweet.place){
                if(tweet.place.full_name){
                    let tweetState = tweet.place.full_name.match(states);
                    if(tweetState){
                        tweet.state = tweetState[0];
                        stateCount[tweet.state] += 1;
                        tweet.stateCount = stateCount[tweet.state];
                        if(tweet.stateCount < 5){
                            tweet.fillKey ="LOW";
                        }
                        else if(tweet.stateCount > 5 && tweet.stateCount < 10){
                            tweet.fillKey ="MEDIUM";
                        }
                        else{
                         tweet.fillKey ="HIGH";
                        }
                        // socket.emit('tweetStream', tweet);
                        socket.broadcast.emit('tweetStream', tweet);
                    }
                }
            }
            return;
        });

        stream.on('error', function(error) {
            console.log(error, 'error')
        });
    })
}

io.on('connection', function(socket) {
    twitterStream(socket, filter)
    socket.on('newFilter', function(data) {
        twitterStream(socket, data)
    });
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/templates', express.static(__dirname + '/views/templates/'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
